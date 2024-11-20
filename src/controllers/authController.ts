import { RequestHandler } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from "path";
import fs from "fs";

// Load environment variables
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY || 'default-secret-key';
if (!SECRET_KEY) {
  throw new Error('SECRET_KEY is not defined in the environment variables');
}


// User type definition
interface User {
  username: string;
  hashedPassword: string;
  firstName: string;
  lastName: string;
}

// Helper function for password encoding
const passwordEncoding = (password: string, salt?: string): string => {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const hashedPassword = crypto.createHmac('sha256', actualSalt).update(password).digest('hex');
  return `${actualSalt}:${hashedPassword}`;
};

// File paths
const POLICIES_FILE = path.resolve(process.cwd(), "src", "data", "policies.json");
const USERS_FILE = path.resolve(process.cwd(), "src", "data", "users.json");



// Helper functions to read and write data
const readUsers = (): User[] => {
  if (!fs.existsSync(USERS_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
};


const writeUsers = (users: User[]) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};


/**
 * POST Signup handler
 */
export const signup: RequestHandler<
  unknown,
  { message: string },
  { username: string; password: string; firstName: string; lastName: string }
> = (req, res, next) => {
  try {
    const { username, password, firstName, lastName } = req.body;

    if (!username || !password || !firstName || !lastName) {
      res.status(400).json({ message: 'All fields are required.' });
      return;
    }

    //Read users from the system
    const users = readUsers();

    if (users.some((user) => user.username === username)) {
      res.status(400).json({ message: 'Username already exists.' });
      return;
    }

    const hashedPassword = passwordEncoding(password);
    users.push({ username, hashedPassword, firstName, lastName });
    writeUsers(users);

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    next(err);
  }
};


 //POST Login handler
 
export const login: RequestHandler<
  unknown,
  { message: string; username?: string; token?: string },
  { username: string; password: string }
> = (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required.' });
      return;
    }


    //Read users from the system
    const users = readUsers();
    const user = users.find((u) => u.username === username);
    console.log(user);
    if (!user) {
      res.status(401).json({ message: 'Invalid username.' });
      return;
    }

    const [storedSalt, storedHash] = user.hashedPassword.split(':');
    const hashedPassword = passwordEncoding(password, storedSalt);

    if (hashedPassword.split(':')[1] !== storedHash) {
      console.log(hashedPassword);
      res.status(401).json({ message: 'Invalid password.' });
      return;
    }

    const token = jwt.sign({ name: `${user.firstName} ${user.lastName}` }, SECRET_KEY, {
      expiresIn: '2h',
    });

    res.status(200).json({
      message: 'Login Successful',
      username: user.username,
      token,
    });
  } catch (err) {
    next(err);
  }
};
