const User = require('../Model/userModel.js');
const generateJWT = require('../Middleware/generateJWT.js');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const appError = require('../utils/appError');
const sendEmail = require('../Services/emailService');


exports.signup = asyncHandler(async (req, res, next) => {
    const { name, email, phone, password, role } = req.body;
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            role
        });
    
    const token = await generateJWT({id: user.id, role: user.role});
  
    res.status(201).json({
      status: 'success',
      token: token,
      data: {
        user
      }
    });

    // send email for user has session free 
    await sendEmail({
      email: user.email,
        subject: 'Congratulations!! 🎉🎉',
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; padding: 20px; background-color: #f9f9f9; color: #333;">
                        <h2 style="color: #2c3e50;">Congratulations!! 🎉🎉 !!مبروك</h2>
                        <p>Dear <strong>${user.name}</strong>,</p>
                        <p>We’re excited to let you know that you’ve earned 10 points!</p>
                        <p>With these points, you can book your first lesson with any teacher of your choice. The lesson will be 25 minutes long.</p>
                        <p>Please make sure to book a time that suits you within this week to take your first lesson!</p>
                        <p>Keep in mind that the first lesson is 25 minutes long, and the booking cannot be changed or canceled.</p>
                        <br>
                        <p> حابین نخبرك إنك حصلت على 10 نقاط، ومع النقاط ھاي تقدر تشتري درس اول مع اي مدرس بدك تبلش معھ والدرس لمدة 25 دقیقة. </p>
                        <p> !!الرجاء حجز موعد یناسبك خلال الأسبوع لأخذ الدرس الأول </p>
                        <p>.لازم تعرف إن الدرس الاول لمدة 25 دقیقة ولا یمكن تغیر أو إلغاء حجزه</p>
                        <p>Kind regards,<br>[Arabe]</p>
                    </div>
                `
    })
  });
    

exports.signIn = asyncHandler(async (req, res, next) => {

       
       const user = await User.findOne({ where: { email: req.body.email } });

        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
         res.status(401).json({
          success: false,
            status: 'fail',
            message: 'Invalid email or password'
        });
        }

        const token = await generateJWT({id: user.id, role: user.role});

        res.status(200).json({
            status: 'success',
            token: token,
            data: {
                user
            }});

});
