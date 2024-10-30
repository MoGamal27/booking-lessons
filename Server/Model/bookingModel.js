const { Model, DataTypes } = require('sequelize');
const sequelize = require('../Config/connectDB');

class Booking extends Model {}

Booking.init({
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  teacherId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Teachers',
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
}, {
  sequelize,
  modelName: 'Booking',
  tableName: 'bookings',
});

module.exports = Booking;

