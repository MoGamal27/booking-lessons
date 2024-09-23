// schedule model
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../Config/connectDB');

class Schedule extends Model { }

Schedule.init({
    teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      availableTimes: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
      },
}, {
    sequelize,
    modelName: 'Schedule',
    tableName: 'schedules',
});

module.exports = Schedule