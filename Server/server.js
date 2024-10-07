require('dotenv').config();
const express = require('express');
const { PORT } = process.env || 3000;
const sequelize = require('./Config/connectDB');
const mainRoutes = require('./Routes/index');
const authRoutes = require('./Routes/authRoutes');
const googleRoutes = require('./Routes/googleRoutes');
const http = require('http');
const socketServer = require('./socketServer');
const chatSocket = require('./sockets/chatSocket');


// Init app
const app = express();
const server = http.createServer(app);
const io = socketServer(server);
chatSocket(io);


// Connect to DB
sequelize.sync()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to sync database:', err);
  });



// Middleware
app.use(express.json());

// Routes
app.use('/api', mainRoutes);
app.use('/auth', googleRoutes);

// global middleware for not found router
app.all("*", (req, res, next) => {
    return res
      .status(404)
      .json({ status: "fail", message: "this resource is not available" });
  });

