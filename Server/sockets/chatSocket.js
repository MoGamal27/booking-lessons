const ChatMessage = require('../Model/chatMessage');
const Booking = require('../Model/bookingModel');
const { Op } = require('sequelize');

module.exports = function(io) {
  io.on('connection', (socket) => {
    socket.on('joinChat', (studentId, teacherId) => {
      socket.join(studentId + '-' + teacherId);
    });

    socket.on('sendMessage', async (message, senderId, receiverId) => {
      try {
        // Check if there's an active booking between the sender and receiver
        const booking = await Booking.findOne({
          where: {
            [Op.or]: [
              { studentId: senderId, teacherId: receiverId },
              { studentId: receiverId, teacherId: senderId }
            ]
          }
        });

        if(!booking) {
          // If there's an active booking, do not allow sending messages
          socket.emit('error', 'Cannot send messages during an active booking');
          return;
        }

        const savedMessage = await ChatMessage.create({
          senderId,
          receiverId,
          message
        });

        io.to(senderId + '-' + receiverId).emit('receiveMessage', savedMessage);
      } catch (error) {
        console.error('Error saving message:', error);
        socket.emit('error', 'Failed to save message');
      }
    });
  });
};


 










