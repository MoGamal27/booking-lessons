const { createBooking, getBookings, getBookingById, updateBooking, deleteBooking } = require("../Controller/bookingController");
const { validateBooking } = require("../utils/validators/bookingValidator");
const router = require('express').Router();

router.post('/', validateBooking ,createBooking);
router.get('/', getBookings);
router.get('/:id', getBookingById);
router.put('/:id', validateBooking ,updateBooking);
router.delete('/:id', deleteBooking);   

module.exports = router;