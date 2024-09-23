const { createTeacher, getAllTeachers, getTeacherById, updateTeacher, deleteTeacher } = require('../Controller/teacherController');
const { validateTeacher } = require('../utils/validators/teacherValidator');
const router = require('express').Router();

router.post('/', validateTeacher ,createTeacher);
router.get('/', getAllTeachers);
router.get('/:id', getTeacherById);
router.put('/:id', validateTeacher ,updateTeacher);
router.delete('/:id', deleteTeacher);

module.exports = router