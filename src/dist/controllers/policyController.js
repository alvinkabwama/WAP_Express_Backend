"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPolicyById = exports.upvotePolicy = exports.getAllPolicies = exports.addPolicy = exports.getPolicies = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// File paths
const POLICIES_FILE = path_1.default.resolve(process.cwd(), "src", "data", "policies.json");
const USERS_FILE = path_1.default.resolve(process.cwd(), "src", "data", "users.json");
// Helper functions to read and write data
const readPolicies = () => {
    if (!fs_1.default.existsSync(POLICIES_FILE)) {
        return [];
    }
    return JSON.parse(fs_1.default.readFileSync(POLICIES_FILE, "utf8"));
};
const readUsers = () => {
    if (!fs_1.default.existsSync(USERS_FILE)) {
        return [];
    }
    return JSON.parse(fs_1.default.readFileSync(USERS_FILE, "utf8"));
};
const writePolicies = (policies) => {
    fs_1.default.writeFileSync(POLICIES_FILE, JSON.stringify(policies, null, 2));
};
// Request Handlers
/**
 * GET /policies
 * Retrieves all policies.
 */
const getPolicies = (req, res, next) => {
    try {
        const policies = readPolicies();
        res.json(policies);
    }
    catch (err) {
        next(err);
    }
};
exports.getPolicies = getPolicies;
/**
 * POST /policies
 * Adds a new policy.
 */
const addPolicy = (req, res, next) => {
    try {
        const { title, description, category } = req.body;
        const username = req.user; // Comes from authMiddleware
        if (!title || !description || !category) {
            res.status(400).json({ message: "All fields are required." });
            return;
        }
        if (!username) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }
        const users = readUsers();
        const user = users.find((u) => u.username === username);
        const policies = readPolicies();
        const newPolicy = {
            id: (policies.length + 1).toString(),
            title,
            description,
            owner: username,
            date: new Date().toISOString().substring(0, 10),
            category,
            votes: [],
        };
        policies.push(newPolicy);
        writePolicies(policies);
        res.status(201).json({ message: "Policy added successfully.", policy: newPolicy });
    }
    catch (err) {
        next(err);
    }
};
exports.addPolicy = addPolicy;
/**
 * GET /policies/all
 * Retrieves all policies with metadata.
 */
const getAllPolicies = (req, res, next) => {
    try {
        const policies = readPolicies();
        res.status(200).json({ message: "Policies retrieved successfully.", policies });
    }
    catch (err) {
        next(err);
    }
};
exports.getAllPolicies = getAllPolicies;
/**
 * POST /policies/:id/upvote
 * Upvotes a specific policy.
 */
const upvotePolicy = (req, res, next) => {
    try {
        const { id } = req.params;
        const username = req.user; // Comes from authMiddleware
        if (!username) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }
        const policies = readPolicies();
        const policy = policies.find((p) => p.id === id);
        if (!policy) {
            res.status(404).json({ message: "Policy not found." });
            return;
        }
        if (policy.votes.includes(username)) {
            res.status(400).json({ message: "You have already voted for this policy." });
            return;
        }
        policy.votes.push(username);
        writePolicies(policies);
        res.status(200).json({ message: "Policy upvoted successfully.", policy });
    }
    catch (err) {
        next(err);
    }
};
exports.upvotePolicy = upvotePolicy;
/**
 * GET /policies/:id
 * Retrieves a specific policy by ID.
 */
const getPolicyById = (req, res, next) => {
    try {
        const { id } = req.params;
        const policies = readPolicies();
        const policy = policies.find((p) => p.id === id);
        if (!policy) {
            res.status(404).json({ message: "Policy not found." });
            return;
        }
        res.status(200).json({ message: "Policy retrieved successfully.", policy });
    }
    catch (err) {
        next(err);
    }
};
exports.getPolicyById = getPolicyById;
// Export all handlers
exports.default = {
    getPolicies: exports.getPolicies,
    addPolicy: exports.addPolicy,
    getAllPolicies: exports.getAllPolicies,
    upvotePolicy: exports.upvotePolicy,
    getPolicyById: exports.getPolicyById,
};
