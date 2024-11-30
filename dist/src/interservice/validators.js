"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPointsRole = void 0;
const express_validator_1 = require("express-validator");
exports.addPointsRole = [
    (0, express_validator_1.body)('fullName').notEmpty().withMessage('fullName is required'),
];
