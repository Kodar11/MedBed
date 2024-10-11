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

    // Log user details
    console.log("User found:", user);

    const accessToken = generateAccessToken(user); 
    const refreshToken = generateRefreshToken(user); 

    // Log generated tokens
    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);

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

  res.cookie("accessToken", accessToken, options);
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

const sendPaymentInfoToHospital = asyncHandler(async (req, res) => {
  // const { userId, paymentId, paymentDoneTime } = req.body;

  // // Validate input fields
  // if (!userId || !paymentId || !paymentDoneTime) {
  //   throw new ApiError(400, "All fields are required");
  // }

  const { userId } = req.body;
    

  // Validate input fields
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  // Hard-coded payment details for testing
  const paymentId = "test_payment_id_12345"; // Replace with your test payment ID
  const paymentDoneTime = new Date().toISOString(); // Current time in ISO format 

  // Fetch user information based on userId
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      username: true,
      email: true,
      phone_number: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Construct the payload to send to the hospital
  const hospitalPayload = {
    user_info: {
      username: user.username,
      email: user.email,
      phone_number: user.phone_number,
    },
    payment_id: paymentId,
    payment_done_time: paymentDoneTime,
  };

  // Here you would typically send the data to the hospital's API or service
  // For demonstration, we'll just log it
  console.log("Sending payment info to hospital:", hospitalPayload);

  // Assuming you have a function to send this data to the hospital
  // await sendToHospital(hospitalPayload);

  // Respond with a success message
  res.status(200).json({ message: "Payment information sent to hospital successfully" });
});


export {
  registerUser,
  loginUser,
  logoutUser,
  sendPaymentInfoToHospital
};
