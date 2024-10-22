const { createBooking, getBookings, getStudentBookings, updateBooking, deleteBooking, CompletedBookings, getCompletedBookings, getBookingByTeacherId } = require("../Controller/bookingController");
const { validateBooking } = require("../utils/validators/bookingValidator");
const verifyToken = require("../Middleware/verifytoken");
const router = require('express').Router();

router.post('/', verifyToken, createBooking);
router.put('/completed', CompletedBookings);
router.get('/completed-booking', getCompletedBookings);
router.get('/', getBookings);
router.get('/student/:studentId' ,getStudentBookings);
router.get('/teacher/:teacherId', getBookingByTeacherId);
router.put('/:id', validateBooking ,updateBooking);
router.delete('/:id', deleteBooking);   

module.exports = router;