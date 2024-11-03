const { Model, DataTypes } = require('sequelize');
const sequelize = require('../Config/connectDB');

class Booking extends Model {}

Booking.init({
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  teacherId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'teachers',
      key: 'id'
    }
  },
  slotDate: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slotTime: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  price: {
    type: DataTypes.INTEGER,
   defaultValue: 0
  },
}, {
  sequelize,
  modelName: 'Booking',
  tableName: 'bookings',
});

module.exports = Booking;

