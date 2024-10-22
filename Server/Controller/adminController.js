 require('dotenv').config();
 const generateJWT = require('../Middleware/generateJWT.js');
 const bcrypt = require('bcrypt');
 const User = require('../Model/userModel');
 const appError = require('../utils/appError');
 const Teacher = require('../Model/teacherModel');
 //API for admin  logn 
 const loginAdmin = async (req, res, next) => {

    try {

        const user = await User.findOne({ where: { email: req.body.email } });

        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
          return next(new appError('Incorrect email or password', 401));
        }
        if(user.role !== 'ADMIN'){
            return next(new appError('You are not authorized to access this resource', 401));
        }

        const token = await generateJWT({id: user.id, role: user.role});

        res.status(200).json({
            success: true,
            token: token,
         });
    } catch (error) {
    console.log(error);
    res.json({success:false, message:error.message})
    }
}

const loginTeacher = async (req, res, next) => {

    try {

        const teacher = await Teacher.findOne({ where: { email: req.body.email } });

        if (!teacher || !(req.body.password === teacher.password)) {
            console.log(teacher);
          return next(new appError('Incorrect email or password', 401));
        }
        
       
        const token = await generateJWT({id: teacher.id});

        res.status(200).json({
            success: true,
            token: token,
         });
    } catch (error) {
    console.log(error);
    res.json({success:false, message:error.message})
    }
}


module.exports = {loginAdmin, loginTeacher};