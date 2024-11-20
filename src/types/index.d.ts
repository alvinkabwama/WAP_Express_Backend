import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: string; // Adjust the type based on your implementation (e.g., string or object)
    }
  }
}
