const router = require('express').Router();
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const teacherRoutes = require('./teacherRoutes');
const bookingRoutes = require('./bookingRoutes');
const adminRoutes = require('./adminRoutes');
const paymentRoutes = require('./paymentRoutes')
const PasswordResetRoutes = require('./password-resetRoute')
const TimeSlotRoutes = require('./TimeSlotsRoutes')

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/teachers', teacherRoutes);
router.use('/bookings', bookingRoutes);
router.use('/admin', adminRoutes);
router.use('/payment', paymentRoutes)
router.use('/password-reset', PasswordResetRoutes)
router.use('/time-slots', TimeSlotRoutes)

module.exports = router;