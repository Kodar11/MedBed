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

  const { reservationId } = req.body;

  // Validate input fields
  if (!reservationId) {
    throw new ApiError(400, "Reservation ID is required");
  }

  // Fetch bed reservation based on reservationId, ensure bed_reservation_time and checkInTime are included
  const bedReservation = await prisma.bedReservation.findUnique({
    where: { id: reservationId },
    select: {
      paymentId: true,
      reservationTime: true,   // Correct field name
      checkInTime: true,       // Use camelCase instead of snake_case
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

  if (!bedReservation) {
    throw new ApiError(404, "Bed reservation not found");
  }

  const { user, paymentId, reservationTime, checkInTime, late_patient } = bedReservation;

  // Get the current time
  const currentTime = new Date();

  // Check if the patient is late (current time is past the check-in time)
  let isLatePatient = late_patient;
  if (!late_patient && checkInTime && currentTime > checkInTime) {
    // Update late_patient to true if the current time has passed the check-in time
    await prisma.bedReservation.update({
      where: { id: reservationId },
      data: { late_patient: true },
    });
    isLatePatient = true;
  }

  // Construct the payload to send to the hospital or user
  const payload = {
    user_info: {
      username: user.username,
      email: user.email,
      phone_number: user.phone_number,
    },
    payment_id: paymentId,
    bed_reservation_time: reservationTime || "Not available", // Use a fallback if null
    check_in_time: checkInTime || "Not yet checked in",        // Use a fallback if null
    late_patient: isLatePatient,
  };

  // Respond with a success message
  res.status(200).json(
    new ApiResponse(200, payload, "Payment and bed reservation info sent successfully")
  );
});




const createBedReservation = asyncHandler(async (req, res) => {
  const { paymentId, userId } = req.body; // Expecting paymentId and userId in the request body

  // Validate input fields
  if (!paymentId || !userId) {
    throw new ApiError(400, "Payment ID and User ID are required");
  }

  // Create a new bed reservation with the default values for check_in and late_patient
  const newReservation = await prisma.bedReservation.create({
    data: {
      paymentId: paymentId,
      reservationTime: new Date(), // Set to current time
      checkInTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      check_in: false, // Default false
      late_patient: false, // Default false
      userId: userId, // Associate with the user
    },
  });

  // Construct the response payload
  const payload = {
    reservationId: newReservation.id,
    paymentId: newReservation.paymentId,
    reservationTime: newReservation.reservationTime,
    checkInTime: newReservation.checkInTime,
    check_in: newReservation.check_in,
    late_patient: newReservation.late_patient,
  };

  // Respond with success message and reservation details
  res.status(201).json(new ApiResponse(201, payload, "Payment successful and reservation created."));
});



export {
  registerUser,
  loginUser,
  logoutUser,
  sendPaymentInfo,
  createBedReservation
};
