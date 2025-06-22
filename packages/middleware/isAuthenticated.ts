import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from 'packages/libs/prisma';

const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized! Token is missing.' });
    }

    // Verify the token (this is a placeholder, implement your own verification logic)

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as { id: string; role: 'user' | 'seller' | 'admin' };

    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized! Invalid token.' });
    }

    // Attach the decoded user information to the request object
    // This allows you to access user information in subsequent middleware or route handlers

    const account = await prisma.users.findUnique({
      where: { id: decoded.id },
    });

    if (!account) {
      return res.status(401).json({ message: 'Unauthorized! User not found.' });
    }

    req.user = account;

    if (!account) {
      return res.status(401).json({ message: 'Account not found.' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
};

export default isAuthenticated;
