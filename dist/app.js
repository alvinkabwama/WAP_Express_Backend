"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const policyRoutes_1 = require("./routes/policyRoutes");
const authRoutes_1 = require("./routes/authRoutes");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
// Routes
app.use('/policies', policyRoutes_1.policiesRoutes);
app.use('/auth', authRoutes_1.authRoutes);
// Error Handler
const errorHandler = (err, req, res, next) => {
    res.status(500).json({ error: err.message });
};
app.use(errorHandler);
exports.default = app;
