import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { PrismaClient } from '@prisma/client';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function isPasswordCorrect(user, password) {
  return await bcrypt.compare(password, user.password);
}

// Function to generate access token
function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      phone_number: user.phone_number,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
}

// Function to generate refresh token
function generateRefreshToken(user) {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
}

// Function to create a new user
async function createUser(data) {
  const hashedPassword = await hashPassword(data.password);

  return await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,  // Ensure your user schema includes 'password'
    },
  });
}

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await prisma.user.update({
      where: { id: userId },
      data: { refresh_token: refreshToken },  // Corrected field name
    });

    return { accessToken, refreshToken };

  } catch (error) {
    console.error("Error generating tokens:", error);  // Log the error
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};




// Register user
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, phone_number } = req.body;

  if ([phone_number, email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if the user already exists
  const existedUser = await prisma.user.findFirst({
    where: {
      OR: [
        { username },
        { email },
        { phone_number: phone_number }
      ]
    }
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const user = await createUser({
    email,
    password,
    username: username.toLowerCase(),
    phone_number: phone_number
  });

  const createdUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      username: true,
      phone_number: true
    }
  });

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res.status(200).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  );
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    throw new ApiError(400, "Username is required");
  }

  const user = await prisma.user.findUnique({
    where: { username }
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await isPasswordCorrect(user, password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.id);

  const loggedInUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      username: true,
      phone_number: true
    }
  });

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "lax"
  };


  res.cookie("accessToken", accessToken);
  return res.status(200).json(
    new ApiResponse(
      200,
      { user: loggedInUser, accessToken, refreshToken },
      "User logged in successfully"
    )
  );
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
  await prisma.user.update({
    where: { id: req.user.id },
    data: { refresh_token: null }
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});


const sendPaymentInfo = asyncHandler(async (req, res) => {
  try {
    const { id: userId } = req.params; // Getting userId from request params

    // Validate input fields
    if (!userId) {
      throw new ApiError(400, "User ID is required");
    }

    console.log("Fetching bed reservations for user ID:", userId);

    // Fetch all bed reservations with user details via relation
    const bedReservations = await prisma.bedReservation.findMany({
      where: { userId: userId }, // Foreign key used here
      select: {
        id: true,
        paymentId: true,
        reservationTime: true,
        checkInTime: true,
        late_patient: true,
        user: {
          select: {
            username: true,
            email: true,
            phone_number: true,
          },
        },
      },
    });

    if (!bedReservations || bedReservations.length === 0) {
      throw new ApiError(404, "No bed reservations found");
    }

    console.log("Bed reservations found:", bedReservations);

    // Check for late patients and update if needed
    const currentTime = new Date();
    const updatedReservations = await Promise.all(
      bedReservations.map(async (reservation) => {
        let isLatePatient = reservation.late_patient;

        if (!isLatePatient && reservation.checkInTime && currentTime > reservation.checkInTime) {
          console.log(`Patient with reservation ID ${reservation.id} is late, updating late_patient field...`);
          await prisma.bedReservation.update({
            where: { id: reservation.id },
            data: { late_patient: true },
          });
          isLatePatient = true;
        }

        // Construct the payload for each reservation
        return {
          reservation_id: reservation.id,
          user_info: {
            username: reservation.user.username,
            email: reservation.user.email,
            phone_number: reservation.user.phone_number,
          },
          payment_id: reservation.paymentId,
          bed_reservation_time: reservation.reservationTime || "Not available",
          check_in_time: reservation.checkInTime || "Not yet checked in",
          late_patient: isLatePatient,
        };
      })
    );

    res.status(200).json(
      new ApiResponse(200, updatedReservations, "All payment and bed reservation info sent successfully")
    );
  } catch (error) {
    console.error("Error in sendPaymentInfo:", error);
    res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
});


const getHospitalReservationInfo = asyncHandler(async (req, res) => {
  try {
    const {hospitalId} = req.params;  // Get hospitalId from request params

    // Validate hospitalId input
    if (!hospitalId) {
      throw new ApiError(400, "Hospital ID is required");
    }

    console.log("Fetching reservations for hospital ID:", hospitalId);

    // Fetch bed reservations associated with this hospital
    const bedReservations = await prisma.bedReservation.findMany({
      where: { hospitalId: hospitalId },  // Get all reservations for this hospital
      select: {
        id: true,
        paymentId: true,
        reservationTime: true,
        checkInTime: true,
        late_patient: true,
        user: {  // Select user info associated with the reservation
          select: {
            username: true,
            email: true,
            phone_number: true,
          },
        },
      },
    });

    if (!bedReservations || bedReservations.length === 0) {
      throw new ApiError(404, "No reservations found for this hospital");
    }

    console.log("Bed reservations found:", bedReservations);

    // Construct the payload
    const reservationInfo = bedReservations.map((reservation) => ({
      reservation_id: reservation.id,
      user_info: {
        username: reservation.user.username,
        email: reservation.user.email,
        phone_number: reservation.user.phone_number,
      },
      payment_id: reservation.paymentId,
      bed_reservation_time: reservation.reservationTime || "Not available",
      check_in_time: reservation.checkInTime || "Not yet checked in",
      late_patient: reservation.late_patient,
    }));

    // Respond with reservation and user info
    res.status(200).json(
      new ApiResponse(200, reservationInfo, "Reservation information retrieved successfully")
    );

  } catch (error) {
    console.error("Error fetching hospital reservation info:", error);
    res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
});



const createBedReservation = asyncHandler(async (req, res) => {
  const { paymentId, userId, hospitalId } = req.body; // Expecting paymentId, userId, and hospitalId in the request body

  // Convert hospitalId to a string to ensure consistency with notifications object
  const formattedHospitalId = String(hospitalId);

  // Debugging Logs
  console.log("Payment Id : ", paymentId);
  console.log("User Id : ", userId);
  console.log("Hospital Id : ", formattedHospitalId);
  console.log("Complete Notifications Object: ", notifications);

  // Validate input fields
  if (!paymentId || !userId || !hospitalId) {
    throw new ApiError(400, "Payment ID, User ID, and Hospital ID are required");
  }

  try {
    // Verify if the hospital exists
    const hospitalExists = await prisma.hospital.findUnique({
      where: { id: formattedHospitalId },
    });

    if (!hospitalExists) {
      return res.status(404).json({ message: "Hospital not found." });
    }

    // Check if we have updated bed data for the hospital from the webhook
    if (!notifications[formattedHospitalId]) {
      return res.status(400).json({ message: "No bed availability data for this hospital." });
    }

    // Retrieve the latest available beds count from the notifications object
    const availableBeds = notifications[formattedHospitalId];

    // Debugging log for the available beds
    console.log(`Available beds for hospital ${formattedHospitalId}:`, availableBeds);

    // Check if no beds are available
    if (availableBeds <= 0) {
      return res.status(400).json({ message: "No beds available for reservation at this hospital." });
    }
    console.log("392");
    
    // Check how many reservations already exist for this hospital
    const currentReservations = await prisma.bedReservation.count({
      where: {
        hospitalId: formattedHospitalId,
        check_in: false, // Assuming reservations that aren't checked in yet
      },
    });

    // Debugging log for the current reservations
    console.log(`Current reservations for hospital ${formattedHospitalId}:`, currentReservations);

    // If current reservations exceed or match the available beds, block the reservation
    if (currentReservations >= availableBeds) {
      return res.status(400).json({ message: "All available beds are already reserved." });
    }

    // Create a new bed reservation
    const newReservation = await prisma.bedReservation.create({
      data: {
        paymentId: paymentId,
        reservationTime: new Date(), // Set to current time
        checkInTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        check_in: false, // Default false
        late_patient: false, // Default false
        userId: userId, // Associate with the user
        hospitalId: formattedHospitalId, // Associate with the hospital
      },
    });

    // Construct the response payload
    const payload = {
      id: newReservation.id,
      paymentId: newReservation.paymentId,
      reservationTime: newReservation.reservationTime,
      checkInTime: newReservation.checkInTime,
      check_in: newReservation.check_in,
      late_patient: newReservation.late_patient,
      userId: newReservation.userId, // Include userId in the response
      hospitalId: newReservation.hospitalId, // Include hospitalId in the response
    };

    // Debugging log for the new reservation
    console.log("New reservation created:", payload);

    // Respond with success message and reservation details
    res.status(201).json(new ApiResponse(201, payload, "Payment successful and reservation created."));
  } catch (error) {
    console.error("Error creating bed reservation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


export const notifications = {}; // In-memory storage for notifications, using hospital_id as the key

// Function to handle incoming notifications
const handleIncomingNotifications = asyncHandler(async (req, res) => {
    const { data, database } = req.body; // Destructure the incoming data and database index

    // Store the incoming notification in memory
    Object.keys(data).forEach(hospital_id => {
        // Update notifications only if there's new data, otherwise, retain the existing value
        notifications[hospital_id] = data[hospital_id] || notifications[hospital_id];
    });

    console.log(`Received notification for database ${database}. Updated counters:`, notifications);

    res.status(200).send({ message: "Notification received and stored" });
});

// Function to get available beds (key: hospital_id, value: availableBeds)
const getAvailableBeds = asyncHandler(async (req, res) => {
  try {
      // Create a new object to hold updated notifications
      const updatedNotifications = {};

      // Loop through the notifications and get reservation counts
      for (const hospital_id in notifications) {
          // Fetch the number of reservations for this hospital
          const reservationCount = await prisma.bedReservation.count({
              where: {
                  hospitalId: hospital_id,
              },
          });

          // Get the current available bed count from the notifications
          const availableBeds = notifications[hospital_id] || 0; // Default to 0 if not defined

          // Subtract the reservation count from the available beds and store the result as key-value
          updatedNotifications[hospital_id] = availableBeds - reservationCount; // Key: hospital_id, Value: availableBeds after subtracting reservations
      }

      // Send the updated notifications object as JSON response
      res.status(200).json(updatedNotifications);
  } catch (error) {
      console.error('Error fetching available beds and reservations:', error);
      res.status(500).json({ message: "Internal server error" });
  }
});


// Controller for searching hospitals
const searchHospitals = async (req, res) => {
  const { query } = req.query; // Get the search query from request params

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const hospitals = await prisma.$queryRaw`
      SELECT * FROM "Hospital"
      WHERE "searchVector" @@ plainto_tsquery('english', ${query})
      ORDER BY ts_rank("searchVector", plainto_tsquery('english', ${query})) DESC;
    `;

    res.status(200).json(hospitals);
  } catch (error) {
    console.error('Error searching hospitals:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




export {
  registerUser,
  loginUser,
  logoutUser,
  sendPaymentInfo,
  createBedReservation,
  getHospitalReservationInfo,
  searchHospitals,
  getAvailableBeds,
  handleIncomingNotifications,
 
};
