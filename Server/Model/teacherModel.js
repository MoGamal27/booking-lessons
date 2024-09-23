// teacher model 
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../Config/connectDB');

class Teacher extends Model {}

Teacher.init({
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bio: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    picture: {
        type: DataTypes.STRING,
        allowNull: false,
    },

}, {
    sequelize,
    modelName: 'Teacher',
    tableName: 'teachers',
});

module.exports = Teacher;

   
    