const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: options.email, 
    subject: options.subject,
    html: options.html || '',
    text: options.text || '',
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;