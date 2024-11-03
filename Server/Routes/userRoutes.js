const { createUser, getAllUsers, getUserById, updateUser, deleteUser, addPoints } = require('../Controller/userController');
const { validateUser } = require('../utils/validators/userValidator');
const verifyToken = require("../Middleware/verifytoken");
const router = require('express').Router();

router.post('/', validateUser ,createUser);
router.get('/', getAllUsers);
router.get('/oneUser/:userId',getUserById);
router.put('/:id', validateUser ,updateUser);
router.put('/point/addPoints' ,addPoints);
router.delete('/:id', deleteUser);


module.exports = router;

