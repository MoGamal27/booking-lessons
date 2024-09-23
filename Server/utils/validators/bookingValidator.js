const { check } = require('express-validator');
const validatorMiddleware = require('../../Middleware/validatorMiddleware');

const validateBooking = [
    check('studentId')
    .notEmpty()
    .withMessage('Student id is required'),

    check('teacherId')
        .notEmpty()
        .withMessage('Teacher id is required'),
   
    check('startTime')
        .notEmpty()
        .withMessage('start time is required'),
        
    check('endTime')
        .notEmpty()
        .withMessage('end time is required'),
    validatorMiddleware
];

module.exports = { validateBooking }