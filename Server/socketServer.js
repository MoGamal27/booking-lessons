const { Server } = require("socket.io");
const cors = require("cors");

module.exports = function(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // Update this with your client's URL
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Initialize chat socket events
    require('./sockets/chatSocket')(io, socket);

   

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};