import crypto from 'crypto';
import { ValidationError } from 'packages/error-handler';
import redis from 'packages/libs/redis';
import { sendEMail } from './sendMail';
import { Request, Response, NextFunction } from 'express';
import prisma from 'packages/libs/prisma';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationData = (
  data: any,
  userType: 'user' | 'seller'
) => {
  const { name, email, password, phone_number, number, country } = data;

  if (
    !name ||
    !email ||
    !password ||
    (userType === 'seller' && (!phone_number || !country))
  ) {
    return new ValidationError(`Missing required fields!`);
  }

  if (!emailRegex.test(email)) {
    return new ValidationError(`Invalid email format!`);
  }
};

export const cheakOtpRestriction = async (
  email: string,
  next: NextFunction
) => {
  if (await redis.get(`otp_lock:${email}`)) {
    return next(
      new ValidationError(
        'Account is locked due to too many OTP requests. Please try again after 30 minutes.'
      )
    );
  }

  if (await redis.get(`otp_spam:${email}`)) {
    return next(
      new ValidationError(
        'You have requested an OTP too frequently. Please wait 1 hour before requesting again.'
      )
    );
  }

  if (await redis.get(`otp_cooldown:${email}`)) {
    return next(
      new ValidationError('Please wait 1minutes before requesting a new otp.')
    );
  }
};

export const tractOtpRequests = async (email: string, next: NextFunction) => {
  const otpRequestKey = `otp_requests_count:${email}`;
  let otpRequest = parseInt((await redis.get(otpRequestKey)) || '0');

  if (otpRequest >= 2) {
    // Lock the account for 60 minutes if the user has made more than 2 OTP requests
    await redis.set(`otp_spam_lock:${email}`, 'locked', 'EX', 3600); // 60 minutes
    return next(
      new ValidationError(
        'Too many OTP requests. Account locked for 30 minutes.'
      )
    );
  }

  await redis.set(otpRequestKey, otpRequest + 1, 'EX', 3600); // Increment the count and set expiration to 1 hour
  // Tracking requests for 1 hour
};

//// Function to send OTP to the user's email

export const sendOtp = async (
  name: string,
  email: string,
  template: string
) => {
  // Generate a random 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  await sendEMail(email, 'Verify your email', template, { otp });

  await redis.set(`otp:${email}`, otp, 'EX', 300); // Store OTP in Redis with a 5-minute expiration
  // Set a cooldown period to prevent spamming

  await redis.set(`otp_cooldown:${email}`, 'true', 'EX', 60); // Set cooldown for 1 minute
};


export const verifyOtp = async (email:string , otp:string , next: NextFunction )  =>  {
  // get the stored OTP from Redis
  const storedOtp = await redis.get(`otp:${email}`);

  console.log(storedOtp, 'storedOtp');

  if (!storedOtp) {
    throw new   ValidationError('OTP has expired or is invalid.');
  }

  const failedAttemptsKey = `otp_attempts:${email}`;
  const failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || '0');



  if (storedOtp !== otp) {
    if (failedAttempts >= 2) {
      // Lock the account for 30 minutes if the user has made more than 2 failed attempts
      await redis.set(`otp_lock:${email}`, 'locked', 'EX', 1800); // 30 minutes
      await redis.del( `otp${email}`, failedAttemptsKey); // Reset failed attempts

      return next(
        new ValidationError(
          'Too many failed attempts. Account locked for 30 minutes.'
        )
      );
    }

    await redis.set(failedAttemptsKey, failedAttempts + 1, 'EX', 300); // Increment failed attempts and set expiration
    return next(new ValidationError(`Incorrect  OTP.${2 - failedAttempts} attemps left .`));  
  }

  // If OTP is valid, delete it from Redis
  await redis.del(`otp:${email}` , failedAttemptsKey); // Reset failed attempts

}


export const handleForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
  userType: "user" | "seller"
) => {
  try {
    const { email } = req.body as { email?: string };
    if (!email) {
      return next(new ValidationError('Email is required.'));
    }

    if (!emailRegex.test(email)) {
      return next(new ValidationError('Invalid email format.'));
    }

    // Check if the user exists in the database
    const user =  await prisma.user.findUnique({
      where : { email },
    })

    if (!user) {
      return next(new ValidationError(`${userType} not found with this email!`));
    }

    // check otp restriction
    await cheakOtpRestriction(email, next);
    // Track OTP requests
    await tractOtpRequests(email, next);

    // generate and send mail

    await sendOtp(user.name,email,  "forgot-password-user-mail" );

    res.status(200).json({
      message: `OTP sent successfully to ${email}. Please check your email to reset your password.`,
    });



  } catch (error) {
    console.error('Error in handleForgotPassword:', error);
    return next(error);
  }
}

export const verifyForgetPassswordOtp = async (
  req: Request, 
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body ;

    if (!email || !otp ) {
      return next(new ValidationError('All fields are required.'));
    }

    if (!emailRegex.test(email)) {
      return next(new ValidationError('Invalid email format.'));
    }

    // Verify the OTP
    await verifyOtp(email, otp, next);

        

    res.status(200).json({
      message: 'otp verified successfully. you can now reset your password.',
    
    });
  } catch (error) {
    console.error('Error in verifyForgetPassswordOtp:', error);
    return next(error);
  }
}