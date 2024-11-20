import express from 'express';
import { signup, login } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleWare';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);



export const authRoutes =  router;
