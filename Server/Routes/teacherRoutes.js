const { createTeacher, getAllTeachers, getTeacherById, updateTeacher, deleteTeacher } = require('../Controller/teacherController');
//const { validateTeacher } = require('../utils/validators/teacherValidator');
//const upload = require('../Middleware/uploadMiddleware');
const verifyRole = require('../Middleware/verifyRole');
const userRoles = require('../utils/userRoles');
const verifyToken = require('../Middleware/verifyToken');
const router = require('express').Router();

router.post('/', verifyToken, verifyRole(userRoles.ADMIN), createTeacher);
router.get('/', getAllTeachers);
router.get('/:id', getTeacherById);
router.put('/:id' , verifyToken , updateTeacher);
router.delete('/:id', verifyRole(userRoles.ADMIN), deleteTeacher);

module.exports = router