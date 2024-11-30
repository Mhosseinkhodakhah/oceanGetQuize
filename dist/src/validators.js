"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subLessonRole = exports.lessonRole = void 0;
const express_validator_1 = require("express-validator");
exports.lessonRole = [
    (0, express_validator_1.body)('name').notEmpty().isString().withMessage('fullName is required'),
    (0, express_validator_1.body)('number').notEmpty().isNumeric().withMessage('username is required'),
];
exports.subLessonRole = [
    (0, express_validator_1.body)('name').notEmpty().isString().withMessage('fullName is required'),
];
