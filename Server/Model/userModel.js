const { Model, DataTypes } = require('sequelize');
const sequelize = require('../Config/connectDB');
const userRoles = require('../utils/userRoles');
class User extends Model {}

User.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM,
        values: Object.values(userRoles),
        allowNull: false,
        defaultValue: userRoles.STUDENT,
    }
}, {
  sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
});

module.exports = User;