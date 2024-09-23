const { check }  = require('express-validator');
const validatorMiddleware = require('../../Middleware/validatorMiddleware');

const validateSchedule = [
    check('teacherId')
        .notEmpty()
        .withMessage('Teacher id is required'), 

    check('availableTimes')
        .notEmpty()
        .withMessage('Available times are required')
        .isLength({ min: 1 })
        .withMessage('Available times must have at least 1 element')

    ,
    validatorMiddleware,
];

module.exports = { validateSchedule };
