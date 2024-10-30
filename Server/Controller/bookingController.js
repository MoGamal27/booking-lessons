const { Booking, User, Schedule, Teacher } = require('../Model/index');
const {  Op} = require('sequelize');
const sendEmail = require('../Services/emailService');


exports.createBooking = async (req, res) => {
    try {
        const { teacherId, slotDate, slotTime } = req.body;
        const studentId = req.currentUser.id;

        // Check if there's an existing booking that overlaps with the requested time
        const existingBooking = await Booking.findOne({
            where: {
                teacherId: teacherId,
                slotDate,
                slotTime,
            }
        });

        if (existingBooking) {
            return res.status(400).json({ success: false, message: 'This time slot is already booked' });
        }

        const booking = await Booking.create({ studentId, teacherId, slotDate, slotTime });
   
        res.status(201).json({ success: true, data: booking });

    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ success: false, message: 'An error occurred while creating the booking' });
    }
};

exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: {
                isCompleted: false  // Only fetch bookings where completed is false
            },
            include: [{
                model: Teacher,
                attributes: ['id', 'name', 'image', 'bio']
            },
            {
                model: User,
                attributes: ['id', 'name', 'email']
            }],
            order: [['slotDate', 'ASC']]
        });

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: 'No incomplete bookings found' });
        }

        // transform the data to match the frontend expectations
        const transformedBookings = bookings.map(booking => {
            return {
                id: booking.id,
                teacher: {
                    id: booking.Teacher.id,
                    name: booking.Teacher.name,
                    image: booking.Teacher.image,
                    bio: booking.Teacher.bio
                },
                student: {
                    id: booking.User.id,
                    name: booking.User.name,
                    email: booking.User.email
                },
                slotDate: booking.slotDate,
                slotTime: booking.slotTime,
                completed: booking.completed  // Include this if you want to explicitly show it's false
            };
        });

        res.status(200).json({
            success: true,
            data: transformedBookings
        });
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred while fetching bookings' });
    }
};

exports.getStudentBookings = async (req, res) => {
    const { studentId } = req.params;

    try {
        const bookings = await Booking.findAll({
            where: { studentId },
            include: [{
                model: Teacher,
                attributes: ['id', 'name', 'image', 'bio']
            }],
            order: [['slotDate', 'ASC']]
        });

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found for this student' });
        }

        // Transform the data to match the frontend expectations
        const formattedBookings = bookings.map(booking => ({
            id: booking.id,
            studentId: booking.studentId,
            teacherId: booking.teacherId,
            slotDate: booking.slotDate,
            slotTime: booking.slotTime,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
            teacher: booking.Teacher ? {
                id: booking.Teacher.id,
                name: booking.Teacher.name,
                image: booking.Teacher.image,
                bio: booking.Teacher.bio
            } : null
        }));

        res.status(200).json({
            success: true,
            data: formattedBookings
        });
    } catch (error) {
        console.error('Error fetching student bookings:', error);
        res.status(500).json({ message: 'An error occurred while fetching bookings', error: error.message });
    }
};

exports.updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { slotDate, slotTime } = req.body;
        const booking = await Booking.findByPk(id);
        if (booking) {
            booking.slotDate = slotDate;
            booking.slotTime = slotTime;
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
            res.status(200).json({ success: true, message: 'Booking deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'An error occurred while deleting the booking' });
    }
};

// edit completed bookings
exports.CompletedBookings = async (req, res) => {
    try {
        const { id } = req.body;
        const booking = await Booking.findByPk(id)
        if (booking) {
            booking.isCompleted = true;
            await booking.save();

            // send email to teacher
            await sendEmail({
                email: (await Teacher.findByPk(booking.teacherId)).email,
                subject: 'Booking Confirmation',
                text: `Dear ${await (Teacher.findByPk(booking.teacherId)).name},
        We would like to confirm a new booking for the lesson scheduled on ${booking.slotDate} at ${booking.slotTime},with ${await (User.findByPk(booking.studentId)).name}.

        Please be ready five minutes before the session time and be prepared for the session, In case of any issues or if the student is unable to attend the lesson, please contact your direct supervisor immediately.

        Thank you for your time and efforts.

       Kind regards,
       [Arabe]`,
            });

            // send email to student
            await sendEmail({
                email: (await User.findByPk(booking.studentId)).email,
                subject: 'Booking Completed',
                text: `Dear ${await (User.findByPk(booking.studentId)).name},
           We are pleased to inform you that your booking has been successfully confirmed from ${booking.slotDate} to ${booking.slotTime}, with ${await (Teacher.findByPk(booking.teacherId)).name}. The total amount for your session is ${await (Teacher.findByPk(booking.teacherId)).fees} NIS.

         If you have any further questions or need assistance, please feel free to reach out to us via WhatsApp at +972 50-292-6398

              Thank you for booking with us!

                 Best regards,
                 [Arabe Academy] `,
            });
            res.status(200).json({
                success: true,
                message:'booking Complated Successfully '});
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
    };

    

exports.getCompletedBookings = async (req, res) => { 
    try {
        const bookings = await Booking.findAll({
            where: { isCompleted:  true },
            include: [{
                model: Teacher,
                attributes: ['id', 'name', 'image', 'bio']
            },
            {
                model: User,
                attributes: ['id', 'name', 'email']
            }],
            order: [['slotDate', 'ASC']]
        });

        const completedBookings = bookings.filter(booking => booking.isCompleted);

        if (completedBookings.length === 0) {
            return res.status(200).json({ 
                success: true, 
                message: 'No completed bookings found',
                data: []
            });
        }

        const transformedBookings = completedBookings.map(booking => ({
            id: booking.id,
            teacher: {
                id: booking.Teacher.id,
                name: booking.Teacher.name,
                image: booking.Teacher.image,
                bio: booking.Teacher.bio
            },
            student: {
                id: booking.User.id,
                name: booking.User.name,
                email: booking.User.email
            },
            slotDate: booking.slotDate,
            slotTime: booking.slotTime
        }));

        res.status(200).json({
            success: true,
            data: transformedBookings
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



exports.getBookingByTeacherId = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const bookings = await Booking.findAll({
            where: { teacherId: teacherId },
            include: [{
                model: Teacher,
                attributes: ['id', 'name', 'image', 'bio']
            },
           {
            model: User,
                attributes: ['id', 'name', 'email']
           }],
            order: [['slotTime', 'ASC']]
        });
        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found' });
        }
        // transform the data to match the frontend expectations
        const transformedBookings = bookings.map(booking => {
            return {
             id: booking.id,
             teacher: {
                 id: booking.Teacher.id,
                 name: booking.Teacher.name,
                 image: booking.Teacher.image,
                 bio: booking.Teacher.bio,
                 fees: booking.Teacher.fees
             },
             student: {
                 id: booking.User.id,
                 name: booking.User.name,
                 email: booking.User.email
             },
             slotDate: booking.slotDate,
             slotTime: booking.slotTime
         };
     });
        res.status(200).json({
            success: true,
            data: transformedBookings
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}


exports.getBookedSlots = async (req, res) => {
    try {
        const { teacherId, slotDate } = req.query;

        const bookings = await Booking.findAll({
            where: {
                teacherId,
                slotDate
            },
            attributes: ['slotTime']
        });

        const bookedSlots = bookings.map(booking => booking.slotTime);

        return res.status(200).json({
            success: true,
            bookedSlots
        });

    } catch (error) {
        console.error('Error fetching booked slots:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching booked slots',
            error: error.message
        });
    }
};