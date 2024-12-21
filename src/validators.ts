import { body, validationResult } from 'express-validator';

export const lessonRole = [
    body('name').notEmpty().isString().withMessage('fullName is required'),
    body('number').notEmpty().isNumeric().withMessage('username is required'),
];


export const subLessonRole = [
    body('name').notEmpty().isString().withMessage('fullName is required'),
];
