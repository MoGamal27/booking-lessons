const Teacher = require('../Model/teacherModel');
const asyncHandler = require('express-async-handler');


exports.getAllTeachers = asyncHandler(async (req, res) => {
    const teachers = await Teacher.findAll();
    res.status(200).json(teachers);

});

exports.getTeacherById = asyncHandler(async (req, res) => {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) {
        res.status(404);
        throw new Error('Teacher not found');
    }
    res.status(200).json(teacher);
});

exports.createTeacher = asyncHandler(async (req, res) => {
    const teacher = await Teacher.create(req.body);
    res.status(201).json(teacher);
});

exports.updateTeacher = asyncHandler(async (req, res) => {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) {
        res.status(404);
        throw new Error('Teacher not found');
    }
    await teacher.update(req.body);
    res.status(200).json(teacher);
})

exports.deleteTeacher = asyncHandler(async (req, res) => {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) {
        res.status(404);
        throw new Error('Teacher not found');
    }
    await teacher.destroy();
    res.status(204).end();
});


