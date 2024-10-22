const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = require('../Controller/userController');
const { validateUser } = require('../utils/validators/userValidator');
const verifyToken = require("../Middleware/verifytoken");
const router = require('express').Router();

router.post('/', validateUser ,createUser);
router.get('/', getAllUsers);
router.get('/', verifyToken ,getUserById);
router.put('/:id', validateUser ,updateUser);
router.delete('/:id', deleteUser);

module.exports = router;

