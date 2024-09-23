const { Booking, User } = require('../Model/index');

exports.createBooking = async (req, res) => {
    try {
        const { studentId, teacherId, startTime, endTime } = req.body;
        const booking = await Booking.create({ studentId, teacherId, startTime, endTime });
        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                { model: User, as: 'Student', attributes: ['id', 'firstName', 'lastName'] },
                { model: User, as: 'Teacher', attributes: ['id', 'firstName', 'lastName'] }
            ]
        });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findByPk(id, {
            include: [
                { model: User, as: 'Student', attributes: ['id', 'firstName', 'lastName'] },
                { model: User, as: 'Teacher', attributes: ['id', 'firstName', 'lastName'] }
            ]
        });
        if (booking) {
            res.status(200).json(booking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { startTime, endTime } = req.body;
        const booking = await Booking.findByPk(id);
        if (booking) {
            booking.startTime = startTime;
            booking.endTime = endTime;
            await booking.save();
            res.status(200).json(booking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Booking.destroy({ where: { id } });
        if (deleted) {
            res.status(204).send("Booking deleted");
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
