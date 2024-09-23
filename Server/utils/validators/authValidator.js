const { check } = require('express-validator');
const validatorMiddleware = require('../../Middleware/validatorMiddleware');
const User = require('../../Model/userModel');

const signupValidator = [
    check('firstName')
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 3 })
        .withMessage('First name must be at least 3 characters long'),

    check('lastName')
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ min: 3 })
        .withMessage('Last name must be at least 3 characters long'),   

    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email address')
        .custom((value) => {
            return User.findOne({ where: { email: value } }).then((user) => {
                if (user) {
                    return Promise.reject('Email already exists');
                }
            });
        }),

    check('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),

    validatorMiddleware,
];  

const signinValidator = [
    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email address'),

    check('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),

    validatorMiddleware,
];

module.exports = { signupValidator, signinValidator };
