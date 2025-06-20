import { NextFunction, Request, Response } from 'express';
import {
  cheakOtpRestriction,
  sendOtp,
  tractOtpRequests,
  validateRegistrationData,
} from '../utils/auth.helper';
import prisma from 'packages/libs/prisma';

import { ValidationError } from 'packages/error-handler';
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

    await sendOtp(email, name, 'user-activation-mail'); // Send OTP using the utility function
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
