import { RequestHandler } from "express";
import fs from "fs";
import path from "path";

//Policy Interface
interface Policy {
  id: string;
  title: string;
  description: string;
  owner: string;
  date: string;
  category: string;
  votes: string[];
}

//User Interface
interface User {
  username: string;
}

// File paths
const POLICIES_FILE = path.resolve(process.cwd(), "src", "data", "policies.json");
const USERS_FILE = path.resolve(process.cwd(), "src", "data", "users.json");

// Helper functions to read and write data
const readPolicies = (): Policy[] => {
  if (!fs.existsSync(POLICIES_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(POLICIES_FILE, "utf8"));
};

const readUsers = (): User[] => {
  if (!fs.existsSync(USERS_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
};

const writePolicies = (policies: Policy[]) => {
  fs.writeFileSync(POLICIES_FILE, JSON.stringify(policies, null, 2));
};

// Request Handlers

/**
 * GET /policies
 * Retrieves all policies.
 */
export const getPolicies: RequestHandler<
  unknown, // URL params
  Policy[], // Response type
  unknown // Request body
> = (req, res, next) => {
  try {
    const policies = readPolicies();
    res.json(policies);
  } catch (err) {
    next(err);
  }
};


 //POST /policies Adds a new policy.

export const addPolicy: RequestHandler<
  unknown, // URL params
  { message: string; policy?: Policy }, // Response type
  { title: string; description: string; category: string } // Request body type
> = (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    const username = req.user as string; // Comes from authMiddleware

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
    const newPolicy: Policy = {
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
  } catch (err) {
    next(err);
  }
};

//GET /policies/all Retrieves all policies with metadata.
 
export const getAllPolicies: RequestHandler<
  unknown, // URL params
  { message: string; policies: Policy[] }, // Response type
  unknown // Request body
> = (req, res, next) => {
  try {
    const policies = readPolicies();
    res.status(200).json({ message: "Policies retrieved successfully.", policies });
  } catch (err) {
    next(err);
  }
};


//POST /policies/:id/upvote Upvotes a specific policy.
export const upvotePolicy: RequestHandler<
  { id: string }, // URL params
  { message: string; policy?: Policy }, // Response type
  unknown // Request body
> = (req, res, next) => {
  try {
    const { id } = req.params;
    const username = req.user as string; // Comes from authMiddleware

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
  } catch (err) {
    next(err);
  }
};


 //GET /policies/:id Retrieves a specific policy by ID.

export const getPolicyById: RequestHandler<
  { id: string }, // URL params
  { message: string; policy?: Policy }, // Response type
  unknown // Request body
> = (req, res, next) => {
  try {
    const { id } = req.params;

    const policies = readPolicies();
    const policy = policies.find((p) => p.id === id);

    if (!policy) {
      res.status(404).json({ message: "Policy not found." });
      return;
    }

    res.status(200).json({ message: "Policy retrieved successfully.", policy });
  } catch (err) {
    next(err);
  }
};

// Export all handlers
export default {
  getPolicies,
  addPolicy,
  getAllPolicies,
  upvotePolicy,
  getPolicyById,
};
