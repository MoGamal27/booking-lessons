const Teacher = require('../Model/teacherModel');
const asyncHandler = require('express-async-handler');
//const { uploadToCloudinary } = require('../Services/cloudinaryService');
//const cloudinary = require('cloudinary').v2

exports.createTeacher = async (req, res) => {
    try {
        const { name, email ,old, bio, image, video, fees } = req.body;
        
        // Create teacher in database
        const teacher = await Teacher.create({
            name,
            email, 
            old, 
            bio,
            image,
            video,
            fees,
        });

        console.log('Teacher created:', teacher);

    } catch (error) {
        console.error('Error in createTeacher:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while creating the teacher. Please try again later.'
        });
    }
};


exports.getAllTeachers = asyncHandler(async (req, res) => {
    const teachers = await Teacher.findAll();
    res.status(200).json({
       success: true,
        data: teachers 
    });

});

exports.getTeacherById = asyncHandler(async (req, res) => {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) {
        res.status(404);
        throw new Error('Teacher not found');
    }
    res.status(200).json({
        success: true,
        data: teacher
    });
});



exports.updateTeacher = asyncHandler(async (req, res) => {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) {
        res.status(404);
        throw new Error('Teacher not found');
    }
    await teacher.update(req.body);
    res.status(200).json({
        success: true,
        data: teacher
    });
})

exports.deleteTeacher = asyncHandler(async (req, res) => {
    const teacher = await Teacher.findByPk(req.params);
    if (!teacher) {
        res.status(404);
        throw new Error('Teacher not found');
    }
    await teacher.destroy();
    res.status(204).end();
});


