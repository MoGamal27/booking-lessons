 require('dotenv').config();
 const generateJWT = require('../Middleware/generateJWT.js');
 const bcrypt = require('bcrypt');
 const User = require('../Model/userModel');
 const appError = require('../utils/appError');
 const Teacher = require('../Model/teacherModel');
 const  Point  = require('../Model/PointModel');
 const asyncHandler = require('express-async-handler');
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

  // increas points user
  const approvePoints = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { pointRequestId } = req.body;
    try{
        const requestPoint = await Point.findByPk(pointRequestId);
        if (!requestPoint) {
            return res.status(404).json({ message: 'Point request not found' });
        }
        const user = await User.findByPk(requestPoint.studentId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
      // Convert points to a floating-point number
      const pointsToAdd = parseFloat(requestPoint.points);
      // Update the user's points
      user.point += pointsToAdd;
      await user.save();

       // Delete the processed point request
      await requestPoint.destroy();

      res.status(200).json({ success: true , message: 'Points added successfully' });

    } catch (error) {
      console.error('Error adding points:', error);
      res.status(500).json({ message: 'Error adding points' });
    }
  })

  // cancel points user
  const cancelPoints = asyncHandler(async (req, res) => {
    console.log('req from cancel', req.query);
    const { pointRequestId } = req.query;
    try{
        const request = await Point.findByPk(pointRequestId);
        if (!request) {
            return res.status(404).json({ message: 'Point request not found' });
        }
        const user = await User.findByPk(request.studentId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
         
        // delete request
        await request.destroy();
        res.status(200).json({ success: true , message: 'Points deleted successfully' });

    } catch (error) {
        console.error('Error adding points:', error);
        res.status(500).json({ message: 'Error adding points' });
    }
  })

  const getPoints = asyncHandler(async (req, res) => {
    const points = await Point.findAll();
    res.status(200).json({
        success: true,
        data: points
    });
});



module.exports = {loginAdmin, loginTeacher, approvePoints, cancelPoints, getPoints};