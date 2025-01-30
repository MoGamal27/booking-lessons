const { createTimeSlot, getTeacherTimeeSlots, updateTimeSlot } = require('../Controller/TimeSlotController');
const express = require('express');
const router = express.Router();

router.post('/createTimeSlot', createTimeSlot);
router.get('/getTeacherTimeeSlots/:teacherId', getTeacherTimeeSlots);
router.put('/updateTimeSlot', updateTimeSlot);


module.exports = router;