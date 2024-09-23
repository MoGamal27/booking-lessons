const User = require('../Model/userModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

// Create a new user
exports.createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
  });
  res.status(201).json(newUser);
  ;
  });
  // Get all users
  exports.getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.findAll();
    res.status(200).json(users);
  });

  // Get a single
  exports.getUserById = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.status(200).json(user);
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
