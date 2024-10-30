const router = require('express').Router();
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const teacherRoutes = require('./teacherRoutes');
const scheduleRoutes = require('./scheduleRoutes');
const bookingRoutes = require('./bookingRoutes');
const adminRoutes = require('./adminRoutes');
const paymentRoutes = require('./paymentRoutes')


router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/teachers', teacherRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/bookings', bookingRoutes);
router.use('/admin', adminRoutes);
router.use('/payment', paymentRoutes)


module.exports = router;