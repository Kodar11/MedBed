import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

 
    const accessToken = user.generateAccessToken(); 
    const refreshToken = user.generateRefreshToken(); 


    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken }
    });

    return { accessToken, refreshToken };

  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

// Register user
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, phone_number } = req.body;

  if (
    [phone_number, email, username, password].some((field) => field?.trim() === "")
  ) {
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


  const user = await prisma.user.create({
    data: {
      email,
      password,
      username: username.toLowerCase(),
      phone_number: phone_number
    }
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


  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }


  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user.id);


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
  return res
    .status(200)
    .json(
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
    data: { refreshToken: null }
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

export {
  registerUser,
  loginUser,
  logoutUser
};
