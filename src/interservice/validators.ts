import { body, validationResult } from 'express-validator';


export const addPointsRole = [
    body('fullName').notEmpty().withMessage('fullName is required'),
];
