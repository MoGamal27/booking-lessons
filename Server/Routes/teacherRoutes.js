const { createTeacher, getAllTeachers, getTeacherById, updateTeacher, deleteTeacher, addPoints } = require('../Controller/teacherController');
//const { validateTeacher } = require('../utils/validators/teacherValidator');
//const upload = require('../Middleware/uploadMiddleware');
const verifyRole = require('../Middleware/verifyRole');
const userRoles = require('../utils/userRoles');
const verifyToken = require('../Middleware/verifyToken');
const router = require('express').Router();

router.post('/', verifyToken, verifyRole(userRoles.ADMIN), createTeacher);
router.post('/point/addPoints', addPoints);
router.get('/', getAllTeachers);
router.get('/:id', getTeacherById);

router.put('/:id' , updateTeacher);
router.delete('/:id', verifyRole(userRoles.ADMIN), deleteTeacher);

module.exports = router