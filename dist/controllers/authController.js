"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Load environment variables
dotenv_1.default.config();
const SECRET_KEY = process.env.SECRET_KEY || 'default-secret-key';
if (!SECRET_KEY) {
    throw new Error('SECRET_KEY is not defined in the environment variables');
}
// Helper function for password encoding
const passwordEncoding = (password, salt) => {
    const actualSalt = salt || crypto_1.default.randomBytes(16).toString('hex');
    const hashedPassword = crypto_1.default.createHmac('sha256', actualSalt).update(password).digest('hex');
    return `${actualSalt}:${hashedPassword}`;
};
// File paths
const POLICIES_FILE = path_1.default.resolve(process.cwd(), "src", "data", "policies.json");
const USERS_FILE = path_1.default.resolve(process.cwd(), "src", "data", "users.json");
// Helper functions to read and write data
const readUsers = () => {
    if (!fs_1.default.existsSync(USERS_FILE)) {
        return [];
    }
    return JSON.parse(fs_1.default.readFileSync(USERS_FILE, "utf8"));
};
const writeUsers = (users) => {
    fs_1.default.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};
/**
 * POST Signup handler
 */
const signup = (req, res, next) => {
    try {
        const { username, password, firstName, lastName } = req.body;
        if (!username || !password || !firstName || !lastName) {
            res.status(400).json({ message: 'All fields are required.' });
            return;
        }
        // Read users from the system
        const users = readUsers();
        if (users.some((user) => user.username === username)) {
            res.status(400).json({ message: 'Username already exists.' });
            return;
        }
        const hashedPassword = passwordEncoding(password);
        users.push({ username, hashedPassword, firstName, lastName });
        writeUsers(users);
        res.status(201).json({ message: 'User registered successfully.' });
    }
    catch (err) {
        next(err);
    }
};
exports.signup = signup;
/**
 * POST Login handler
 */
const login = (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ message: 'Username and password are required.' });
            return;
        }
        // Read users from the system
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
        const token = jsonwebtoken_1.default.sign({ name: `${user.firstName} ${user.lastName}` }, SECRET_KEY, {
            expiresIn: '2h',
        });
        res.status(200).json({
            message: 'Login Successful',
            username: user.username,
            token,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
