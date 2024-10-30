const { createUser, getAllUsers, getUserById, updateUser, deleteUser, addPoints } = require('../Controller/userController');
const { validateUser } = require('../utils/validators/userValidator');
const verifyToken = require("../Middleware/verifytoken");
const router = require('express').Router();

router.post('/', validateUser ,createUser);
router.get('/', getAllUsers);
router.get('/:id', verifyToken ,getUserById);
router.put('/:id', validateUser ,updateUser);
router.post('/addPoints/:id' ,addPoints);
router.delete('/:id', deleteUser);


module.exports = router;

