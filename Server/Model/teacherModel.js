// teacher model 
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../Config/connectDB');

class Teacher extends Model {}

Teacher.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
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
        allowNull: true,
    },
    video: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fees: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'Teacher',
    tableName: 'teachers',
});

module.exports = Teacher;

   
    