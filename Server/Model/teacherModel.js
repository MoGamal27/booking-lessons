// teacher model 
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../Config/connectDB');

class Teacher extends Model {}

Teacher.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    old: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    video: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Teacher',
    tableName: 'teachers',
});

module.exports = Teacher;

   
    