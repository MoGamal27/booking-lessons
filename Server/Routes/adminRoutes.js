const { loginAdmin, loginTeacher } = require('../Controller/adminController');
const express = require("express");

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/loginTeacher', loginTeacher);

module.exports = router;
