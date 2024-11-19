const { loginAdmin, loginTeacher, approvePoints, cancelPoints, getPoints } = require('../Controller/adminController');
const express = require("express");

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/loginTeacher', loginTeacher);

router.put('/point/approvePoints', approvePoints);

router.get('/point/getPoints', getPoints);

router.delete('/point/cancelPoints', cancelPoints);

module.exports = router;
