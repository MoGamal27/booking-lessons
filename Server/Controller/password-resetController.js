require('dotenv').config();
const Token = require('../Model/tokenModel');
const User = require('../Model/userModel');
const asyncHandler = require('express-async-handler');
const appError = require('../utils/appError');
const crypto = require('crypto');
const sendEmail = require('../Services/emailService');
const bcrypt = require('bcrypt');


// send password reset link
exports.resetPassword = asyncHandler(async (req, res, next) => {

    const user = await User.findOne({ where:{ email: req.body.email} });

    if (!user) {
        return next(new appError("User not found", 404));
    }
    

    let token = await Token.findOne({ where: { userId: user.id  } });
        if (!token) {
            token = await new Token({
                userId: user.id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }

        const link = `${process.env.BASE_URL}/${user.id}/${token.token}`;
        await sendEmail({
            email: user.email,
            subject: "Reset Password",
            html: `<a href="${link}">Reset Password</a>`,
        });

        res.send("password reset link sent to your email account");


})

// Reset user password
exports.resetUserPassword = asyncHandler(async (req, res, next) => {

    const user = await User.findByPk(req.params.userId);

    if (!user) {
        return next(new appError("User not found", 404));
    }

    const token = await Token.findOne({
        where: {
            userId: user.id,
            token: req.params.token,
        }
    });

    if (!token) return res.status(400).send("Invalid link or expired");
      
       const { password } = req.body;
       
       if(!password) return res.status(400).send("Please provide new password");

       const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;

        await user.save();
       // await token.delete();

        res.send("password reset sucessfully.");

})