const router = require('express').Router();
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const teacherRoutes = require('./teacherRoutes');
const scheduleRoutes = require('./scheduleRoutes');
const bookingRoutes = require('./bookingRoutes');


router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/teachers', teacherRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/bookings', bookingRoutes);



module.exports = router;