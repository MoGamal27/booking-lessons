const User = require('../Model/userModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

// Create a new user
exports.createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error while creating user:', err); // Log the full error
    res.status(500).json({ message: 'User creation failed', error: err.message });
  }
  });
  // Get all users
  exports.getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.findAll();
    res.status(200).json({
      success: true,
      data: users,
    });
  });

  // Get a single
  exports.getUserById = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  });

  // Update a user
  exports.updateUser = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    const updatedUser = await user.update(req.body);
    res.status(200).json(updatedUser);
});

// Delete a user
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  await user.destroy();
  res.status(204).end();
  });

  // increas points user
exports.addPoints = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { userId, points } = req.body;
  try{
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    // Convert points to a floating-point number
    const pointsToAdd = parseInt(points);

    // Update the user's points
    user.point += pointsToAdd;
    await user.save();
    res.status(200).json({ success: true , message: 'Points added successfully' });
  } catch (error) {
    console.error('Error adding points:', error);
    res.status(500).json({ message: 'Error adding points' });
  }
})

