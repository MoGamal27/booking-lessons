const User = require('../Model/userModel.js');
const generateJWT = require('../Middleware/generateJWT.js');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const appError = require('../utils/appError');

exports.signup = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, email, password, role } = req.body;
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role
        });
    
    const token = await generateJWT({id: user._id, role: user.role});
  
    res.status(201).json({
      status: 'success',
      token: token,
      data: {
        user
      }
    });
  });
    

exports.signIn = asyncHandler(async (req, res, next) => {

       
       const user = await User.findOne({ where: { email: req.body.email } });

        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
          return next(new appError('Incorrect email or password', 401));
        }

        const token = await generateJWT({id: user._id, role: user.role});

        res.status(200).json({
            status: 'success',
            token: token,
            data: {
                user
            }});

});
