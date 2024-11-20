import { Router } from "express";
import policyController from '../controllers/policyController';

import { authenticateToken,} from "../middlewares/authMiddleWare";

const router = Router();

// Route to add a new policy (protected route)
router.post("/add", authenticateToken, policyController.addPolicy);

// Route to get all policies
router.get("/all", policyController.getAllPolicies);

// Route to upvote a policy (protected route)
router.post("/upvote/:id", authenticateToken, policyController.upvotePolicy);

// Route to get a specific policy by ID
router.get("/:id", policyController.getPolicyById);

export const policiesRoutes = router;
