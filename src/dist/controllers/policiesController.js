"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPolicies = void 0;
const getAllPolicies = (req, resp, next) => {
    resp.json({ message: 'Fetching all policies' });
};
exports.getAllPolicies = getAllPolicies;
