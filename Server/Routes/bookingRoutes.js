const { createBooking, getBookings, getStudentBookings, updateBooking, deleteBooking, CompletedBookings, getCompletedBookings, getBookingByTeacherId, getBookedSlots } = require("../Controller/bookingController");
const { validateBooking } = require("../utils/validators/bookingValidator");
const verifyToken = require("../Middleware/verifyToken");
const router = require('express').Router();

router.post('/create', verifyToken, createBooking);
router.put('/completed', CompletedBookings);
router.get('/completed-booking', getCompletedBookings);
router.get('/', getBookings);
router.get('/student/:studentId' ,getStudentBookings);
router.get('/teacher/:teacherId', getBookingByTeacherId);
router.put('/:id', validateBooking ,updateBooking);
router.delete('/:id', deleteBooking);   
router.get('/booked-slots', getBookedSlots);

module.exports = router;