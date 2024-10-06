const { check } = require('express-validator');
const validatorMiddleware = require('../../Middleware/validatorMiddleware');


const validateTeacher = [
    check('userName')
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long'),

    check('bio')
        .notEmpty()
        .withMessage('Bio is required')
        .isLength({ min: 3 })
        .withMessage('Bio must be at least 3 characters long'),

    check('image')
        .notEmpty()
        .withMessage('Image is required'),
    ,
    validatorMiddleware,
];

module.exports = { validateTeacher };