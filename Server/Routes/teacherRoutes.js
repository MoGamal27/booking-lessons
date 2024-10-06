const { createTeacher, getAllTeachers, getTeacherById, updateTeacher, deleteTeacher } = require('../Controller/teacherController');
//const { validateTeacher } = require('../utils/validators/teacherValidator');
//const upload = require('../Middleware/uploadMiddleware');
const router = require('express').Router();

router.post('/',createTeacher);
router.get('/', getAllTeachers);
router.get('/:id', getTeacherById);
router.put('/:id' ,updateTeacher);
router.delete('/:id', deleteTeacher);

module.exports = router