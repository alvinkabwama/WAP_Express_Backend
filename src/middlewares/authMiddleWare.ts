import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY: string = process.env.SECRET_KEY || 'default-secret-key';

// Extend the Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: string;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader: string | undefined = req.header('Authorization');
  console.log('Authorization Header:', authHeader);

  if (!authHeader) {
    res.status(401).json({ message: 'Unauthorized: Authorization header is missing' });
    return; // Ensure middleware does not call `next()` after sending a response
  }

  const token: string | undefined = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Unauthorized: Token is missing' });
    return; // Ensure middleware does not call `next()` after sending a response
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { name: string };
    req.user = decoded.name; // Attach user name to request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
    return; // Ensure middleware does not call `next()` after sending a response
  }
};
