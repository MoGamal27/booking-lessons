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
            return res.status(404).json({ success: false ,message: 'No incomplete bookings found' });
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
            return res.status(200).json({ 
                succuess: true,
                message: 'No bookings found for this student',
                data: []
            });
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
        
        // Validate if ID exists
        if (!id) {
            return res.status(400).json({ 
                success: false,
                message: 'Booking ID is required' 
            });
        }

        const booking = await Booking.findByPk(id);
        if (!booking) {
            return res.status(404).json({ 
                success: false,
                message: 'Booking not found' 
            });
        }

        // Check if booking is already completed
        if (booking.isCompleted) {
            return res.status(400).json({
                success: false,
                message: 'Booking is already marked as completed'
            });
        }

        booking.isCompleted = true;
        await booking.save();

        // Fetch teacher and student data with error handling
        const teacher = await Teacher.findByPk(booking.teacherId);
        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher information not found'
            });
        }

        const student = await User.findByPk(booking.studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student information not found'
            });
        }

        // Send emails to teacher 
        try {
            await sendEmail({
                email: teacher.email,
                subject: 'Booking Confirmation',
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; padding: 20px; background-color: #f9f9f9; color: #333;">
                        <h2 style="color: #2c3e50;">Booking Confirmation</h2>
                        <p>Dear <strong>${teacher.name}</strong>,</p>
                        <p>We would like to confirm a new booking for the lesson scheduled on <strong>${booking.slotDate}</strong> at <strong>${booking.slotTime}</strong>, with <strong>${student.email}</strong>.</p>
                        <p>Please be ready five minutes before the session time and be prepared for the session. In case of any issues or if the student is unable to attend the lesson, please contact your direct supervisor immediately.</p>
                        <p>Thank you for your time and efforts.</p>
                        <p>Kind regards,<br>[Arabe]</p>
                    </div>
                `
            });
            // Send email to student
            await sendEmail({
                email: student.email,
                subject: 'Booking Completed',
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; padding: 20px; background-color: #f9f9f9; color: #333;">
                        <h2 style="color: #2c3e50;">Booking Completed</h2>
                        <p>Dear <strong>${student.name}</strong>,</p>
                        <p>We are pleased to inform you that your booking has been successfully confirmed from <strong>${booking.slotDate}</strong> to <strong>${booking.slotTime}</strong>, with <strong>${teacher.email}</strong>. The total amount for your session is <strong>${teacher.fees}$</strong>.</p>
                        <p>If you have any further questions or need assistance, please feel free to reach out to us via WhatsApp at <strong>+972 50-292-6398</strong>.</p>
                        <p>Link to the lesson: <a href="${teacher.zoomLink}">${teacher.zoomLink}</a></p>
                        <p>Thank you for booking with us!</p>
                        <p>Best regards,<br>[Arabe Academy]</p>
                    </div>
                `
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Continue with the response even if email fails
        }

        return res.status(200).json({
            success: true,
            message: 'Booking Completed Successfully'
        });

    } catch (error) {
        console.error('CompletedBookings Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
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
                attributes: ['id', 'name', 'point' ,'email']
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

// get completed course by student id
exports.getCompletedCourses = async (req, res) => {
    try {
        const studentId = req.currentUser.id;
        const completedCourses = await Booking.findAll({
            where: { studentId, isCompleted: true },
            include: [{
                model: Teacher,
                attributes: ['id', 'name', 'image']
            }],
            order: [['slotDate', 'ASC']]
        })
        res.status(200).json({
                success: true,
                data: completedCourses
            });
        } catch (error) {
            console.error('Error fetching completed courses:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching completed courses',
                error: error.message
            });
        }
    }