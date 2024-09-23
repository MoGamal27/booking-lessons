require('dotenv').config();
const jwt = require('jsonwebtoken');
const appError = require('../utils/appError');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    if(!authHeader) {
        
        return next(new appError('No token provided', 401));
    }

    const token = authHeader.split(' ')[1];
    try {

        const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.currentUser = currentUser;
        next();

    } catch (err) {
        
        return next(new appError('Invalid token', 401));
    }   
    
}

module.exports = verifyToken;