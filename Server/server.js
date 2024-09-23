require('dotenv').config();
const express = require('express');
const { PORT } = process.env;
const sequelize = require('./Config/connectDB');
const mainRoutes = require('./Routes/index');
// Init app
const app = express();


// Connect to DB
sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
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

// global middleware for not found router
app.all("*", (req, res, next) => {
    return res
      .status(404)
      .json({ status: "fail", message: "this resource is not available" });
  });

  
  

