"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const policiesController_1 = require("../controllers/policiesController");
const router = (0, express_1.Router)();
router.get('/', policiesController_1.getAllPolicies);
exports.default = router;
