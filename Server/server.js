require('dotenv').config();
const express = require('express');
const { PORT } = process.env || 3000;
const sequelize = require('./Config/connectDB');
const mainRoutes = require('./Routes/index');
const authRoutes = require('./Routes/authRoutes');
const googleRoutes = require('./Routes/googleRoutes');
const cors = require('cors');
const http = require('http');
const app = express();



// Enable CORS for all origins
app.use(cors({
  origin: '*'
}));



const server = http.createServer(app);



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

