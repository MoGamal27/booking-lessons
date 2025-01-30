const { Model, DataTypes } = require('sequelize');
const sequelize = require('../Config/connectDB');

class TimeSlot extends Model {}
TimeSlot.init({
    teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    timeSlot: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      dayOfWeek: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
}, {
    sequelize,
    modelName: 'TimeSlot',
    tableName: 'time_slots',
});

module.exports = TimeSlot