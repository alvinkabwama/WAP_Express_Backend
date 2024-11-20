"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = process.env.SECRET_KEY || 'default-secret-key';
const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log('Authorization Header:', authHeader);
    if (!authHeader) {
        res.status(401).json({ message: 'Unauthorized: Authorization header is missing' });
        return; // Ensure middleware does not call `next()` after sending a response
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Unauthorized: Token is missing' });
        return; // Ensure middleware does not call `next()` after sending a response
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        req.user = decoded.name; // Attach user name to request
        next(); // Proceed to the next middleware or route handler
    }
    catch (err) {
        res.status(403).json({ message: 'Invalid or expired token' });
        return; // Ensure middleware does not call `next()` after sending a response
    }
};
exports.authenticateToken = authenticateToken;
