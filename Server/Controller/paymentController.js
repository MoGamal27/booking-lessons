require('dotenv').config()
const {Booking, Teacher, User} = require('../Model/index');
const paypal = require('@paypal/checkout-server-sdk');
const sendEmail = require('../Services/emailService');
const asyncHandeler = require('express-async-handler');

const environment = new paypal.core.SandboxEnvironment('AfhUouOs3xx6CHsWXPhX1K9dUfk0231k2U-8Nra2NkkTRdBdyIkOZVHkbnqEf-E54oMjXlfHTBe8Ddl6', 'EG6XpzScO4iLucG7UJawJANZIO3CV1zQB3I7sUbI064hQeinLhrJVOdw9wHv0nEXnzcVxnOAT3IDkV-T');
const client = new paypal.core.PayPalHttpClient(environment);

exports.createOrder = async (req, res) => {
  const { bookings } = req.body;
  console.log("Received bookings:", bookings);

  // Fetch the bookings from the database with teacher information
  const bookingsData = await Booking.findAll({
    where: {
      id: bookings,
    },
    include: [{
      model: Teacher,
      attributes: ['fees']
    }]
  });

  // Calculate total amount based on teacher fees
  const totalAmount = bookingsData.reduce((total, booking) => total + booking.Teacher.fees, 0);

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: totalAmount.toFixed(2),
        },
      },
    ],
  });

  try {
    const order = await client.execute(request);
    res.status(200).json({ orderID: order.result.id });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    res.status(500).json({ message: "Failed to create PayPal order" });
  }
};


// pay with student points
/*exports.payWithPoints = async (req, res) => {
  const { bookingId, studentId } = req.body;
  
  const booking = await Booking.findByPk(bookingId);
  const student = await User.findByPk(studentId);
  if (!booking || !student) {
    return res.status(404).json({ message: "Booking or student not found" });
  }
  if (booking.studentId !== studentId) {
    return res.status(403).json({ message: "You are not authorized to pay for this booking" });
  }
  if (student.point < 20) {
    return res.status(400).json({ message: "Insufficient points" });
  }
  if (booking.isCompleted) {
    return res.status(400).json({ message: "Booking is already completed" });
  }

  student.point -= 60;
  await student.save();
  
  booking.isCompleted = true;
  await booking.save();
  // message to admin to confirm payment

 const teacher = await Teacher.findByPk(booking.teacherId);
  if (!teacher) {
      return res.status(404).json({
          success: false,
          message: 'Teacher information not found'
      });
  }

  await sendEmail({
    email: 'engmogamil@gmail.com',
    subject: 'Booking Confirmation',
    html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; padding: 20px; background-color: #f9f9f9; color: #333;">
            <h2 style="color: #2c3e50;">Booking Confirmation</h2>
            <p>Dear <strong>Admin</strong>,</p>
            <p>Student <strong>${student.email}</strong> has paid for booking <strong>${teacher.email}</p>
            <p>Points deducted: <strong>60</strong>.</p>
            <p>Remaining points: <strong>${student.point}</strong>.</p>
        </div>
    `
});

// message to teacher
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

// message to student 
await sendEmail({
  email: student.email,
  subject: 'Booking Completed',
  html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; padding: 20px; background-color: #f9f9f9; color: #333;">
          <h2 style="color: #2c3e50;">Booking Completed</h2>
          <p>Dear <strong>${student.name}</strong>,</p>
          <p>We are pleased to inform you that your booking has been successfully confirmed from <strong>${booking.slotDate}</strong> to <strong>${booking.slotTime}</strong>, with <strong>${teacher.email}</strong>. Points deducted for the booking: <strong>20</strong>. Your remaining points are now : <strong> ${student.point}</strong>.</p>
          <p>If you have any further questions or need assistance, please feel free to reach out to us via WhatsApp at <strong>+972 50-292-6398</strong>.</p>
          <p>Link to the lesson: <a href="${teacher.zoomLink}">${teacher.zoomLink}</a></p>
          <p>Thank you for booking with us!</p>
          <p>Best regards,<br>[Arabe Academy]</p>
      </div>
  `
});

  res.status(200).json({ message: "Payment successful" });
};*/


exports.payWithPoints = asyncHandeler(async (req, res) => {
  const { bookingId, studentId } = req.body;

  const booking = await Booking.findByPk(bookingId);
  const student = await User.findByPk(studentId);

  if (!booking || !student) {
    return res.status(404).json({ 
      success: false,
      message: "Booking or student not found" });
  }

  if (booking.studentId !== studentId) {
    return res.status(403).json({ 
      success: false,
      message: "You are not authorized to pay for this booking" });
  }

  if (booking.isCompleted) {
    return res.status(400).json({ 
      success: false,
      message: "Booking is already completed" });
  }

  // Check if this is the student's first booking
  const previousBookings = await Booking.count({
    where: {
      studentId,
      isCompleted: true
    }
  });

  const requiredPoints = previousBookings === 0 ? 10 : 20;

  if (student.point < requiredPoints) {
    return res.status(400).json({
      success: false, 
      message: `Insufficient points. You need ${requiredPoints} points for this booking.` 
    });
  }

  // Deduct points based on booking history
  student.point -= requiredPoints;
  await student.save();

  booking.isCompleted = true;
  await booking.save();

  const teacher = await Teacher.findByPk(booking.teacherId);
  if (!teacher) {
    return res.status(404).json({
      success: false,
      message: 'Teacher information not found'
    });
  }

  res.status(200).json({ 
    success: true,
    message: "Payment successful",
    pointsDeducted: requiredPoints,
    remainingPoints: student.point
  });

  // Admin notification email
  await sendEmail({
    email: 'engmogamil@gmail.com',
    subject: 'Booking Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; padding: 20px; background-color: #f9f9f9; color: #333;">
        <h2 style="color: #2c3e50;">Booking Confirmation</h2>
        <p>Dear <strong>Admin</strong>,</p>
        <p>Student <strong>${student.email}</strong> has paid for booking <strong>${teacher.email}</strong></p>
        <p>Points deducted: <strong>${requiredPoints}</strong>.</p>
        <p>Remaining points: <strong>${student.point}</strong>.</p>
      </div>
    `
  });

  // Teacher notification email
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

  // Student notification email
  await sendEmail({
    email: student.email,
    subject: 'Booking Completed',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; padding: 20px; background-color: #f9f9f9; color: #333;">
        <h2 style="color: #2c3e50;">Booking Completed</h2>
        <p>Dear <strong>${student.name}</strong>,</p>
        <p>We are pleased to inform you that your booking has been successfully confirmed from <strong>${booking.slotDate}</strong> to <strong>${booking.slotTime}</strong>, with <strong>${teacher.email}</strong>. Points deducted for the booking: <strong>${requiredPoints}</strong>. Your remaining points are now: <strong>${student.point}</strong>.</p>
        <p>If you have any further questions or need assistance, please feel free to reach out to us via WhatsApp at <strong>+972 50-292-6398</strong>.</p>
        <p>Link to the lesson: <a href="${teacher.zoomLink}">${teacher.zoomLink}</a></p>
        <p>Thank you for booking with us!</p>
        <p>Best regards,<br>[Arabe Academy]</p>
      </div>
    `
  });

});
