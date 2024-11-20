"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.policiesRoutes = void 0;
const express_1 = require("express");
const policyController_1 = __importDefault(require("../controllers/policyController"));
const authMiddleWare_1 = require("../middlewares/authMiddleWare");
const router = (0, express_1.Router)();
// Route to add a new policy (protected route)
router.post("/add", authMiddleWare_1.authenticateToken, policyController_1.default.addPolicy);
// Route to get all policies
router.get("/all", policyController_1.default.getAllPolicies);
// Route to upvote a policy (protected route)
router.post("/upvote/:id", authMiddleWare_1.authenticateToken, policyController_1.default.upvotePolicy);
// Route to get a specific policy by ID
router.get("/:id", policyController_1.default.getPolicyById);
exports.policiesRoutes = router;
