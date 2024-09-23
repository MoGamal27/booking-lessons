const { createSchedule, getAllSchedules, getScheduleByTeacher, updateSchedule, deleteSchedule } = require('../Controller/scheduleController');
const { validateSchedule } = require('../utils/validators/scheduleValidator');
const router = require('express').Router();

router.post('/', validateSchedule ,createSchedule);
router.get('/', getAllSchedules);
router.get('/:id', getScheduleByTeacher);
router.put('/:id', validateSchedule ,updateSchedule);
router.delete('/:id', deleteSchedule);

module.exports = router;
