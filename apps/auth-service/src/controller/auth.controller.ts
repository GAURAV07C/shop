import { NextFunction, Request, Response } from 'express';
import {
  cheakOtpRestriction,
  handleForgotPassword,
  sendOtp,
  tractOtpRequests,
  validateRegistrationData,
  verifyForgetPassswordOtp,
  verifyOtp,
} from '../utils/auth.helper';
// import prisma from 'packages/libs/prisma/index';
import { PrismaClient } from '../../../../generated/prisma/client';
import { AuthError, ValidationError } from 'packages/error-handler';

import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { setCookie } from '../utils/cookies/setCookie';
const prisma = new PrismaClient();
// const prisma =[];
export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the registration data
    // using the utility function
    validateRegistrationData(req.body, 'user');
    const { name, email } = req.body;
    // Check if the user already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    // const existingUser = prisma.find((user) => user.email === email);
    // If the user already exists, throw a validation error
    if (existingUser) {
      return next(new ValidationError('User already exists with this email!'));
    }
    // Check if the email is already registered

    await cheakOtpRestriction(email, next); // Check for OTP restrictions
    // Proceed to track OTP requests

    await tractOtpRequests(email, next); // Track OTP requests
    // Send OTP to the user's email

    await sendOtp(name, email, 'user-activation-mail'); // Send OTP using the utility function
    // Respond with a success message

    res.status(200).json({
      message:
        'Otp sent successfully send to your email! Please verify  your account.',
    });
  } catch (error) {
    console.error('Error in user registration:', error);
    return next(error);
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, password, name } = req.body;

    if (!email || !otp || !password || !name) {
      return next(new ValidationError('All fields are require.'));
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(new ValidationError('User already exists with this email!'));
    }

    await verifyOtp(email, otp, next); // Verify the OTP
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
    });
  } catch (error) {
    console.error('Error in user verification:', error);
    return next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ValidationError('Email and password are required.'));
    }

    // Check if the user exists in the database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return next(new ValidationError('User not found with this email!'));
    }

    // Compare the provided password with the stored hashed password

    const isPasswordValid = await bcrypt.compare(password, user.password!);

    if (!isPasswordValid) {
      return next(new AuthError('Invalid email or password!'));
    }

    // Generate a JWT token for the user
    const accessToken = jwt.sign(
      { id: user.id, role: 'user' },
      (process.env.ACCESS_TOKEN_SECRET as string) || 'default_secret',
      { expiresIn: '15m' } // Token expiration time
    );
    // Generate a refresh token
    const refreshToken = jwt.sign(
      { id: user.id, role: 'user' },
      (process.env.REFRESH_TOKEN_SECRET as string) || 'default_refresh_secret',
      { expiresIn: '7d' } // Refresh token expiration time
    );

    // Store the refresh and  token in httpOnly  secure cookies

    setCookie(res, 'refresh_Token', refreshToken);
    setCookie(res, 'access_Token', accessToken);

    res.status(200).json({
      success: true,
      message: 'User logged in successfully!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Error in user login:', error);
    return next(error);
  }
};

export const refereshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.referesh_token;

    if (!refreshToken) {
      return next(new ValidationError('unauthorized! No refresh token.'));
    }

    // Verify the refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { id: string; role: string };

    if (!decoded || !decoded.id || !decoded.role) {
      return next(new JsonWebTokenError('Invalid refresh token.'));
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return next(new AuthError('Forbidden! User/Seller not found.'));
    }

    // Generate a new access token
    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '15m' }
    );

    setCookie(res, 'access_Token', newAccessToken);

    res.status(200).json({
      success: true,
      message: 'Access token refreshed successfully!',
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error('Error in user refresh token:', error);
    return next(error);
  }
};

// get logged in user details

export const getUser = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {

    const user = req.user; // Assuming user is attached to req by authentication middleware

    res.status(200).json({
      success: true,
      message: 'User details retrieved successfully!',
      user,
    });
   
    
  } catch (error) {
    console.error('Error in get user details:', error);
    return next(error);
  }
};

// Forgot password handler

export const userForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await handleForgotPassword(req, res, next, 'user');
  } catch (error) {
    console.error('Error in user forgot password:', error);
    return next(error);
  }
};

// Verify OTP handler
export const verifyUserForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await verifyForgetPassswordOtp(req, res, next);
};

// Reset password handler

export const resetUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return next(
        new ValidationError('Email,  and new password are required.')
      );
    }

    // Check if the user exists in the database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return next(new ValidationError('User not found with this email!'));
    }

    // compare the new password with the stored hashed password
    const isSamePassword = await bcrypt.compare(newPassword, user.password!);

    if (isSamePassword) {
      return next(
        new ValidationError(
          'New password cannot be the same as the old password.'
        )
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Update the user's password in the database
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    res.status(200).json({
      success: true,
      message:
        'Password reset successfully! You can now log in with your new password.',
    });
  } catch (error) {
    console.error('Error in reset user password:', error);
    return next(error);
  }
};
