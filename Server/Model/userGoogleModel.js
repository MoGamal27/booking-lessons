// user googel

const { Model,DataTypes } = require('sequelize');
const sequelize = require('../Config/connectDB');

class UserGoogle extends Model {}

UserGoogle.init({
    googleId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    googleToken: {
      type: DataTypes.JSON,
      allowNull: false
    }
}, {
    sequelize,
    modelName: 'UserGoogle',
    tableName: 'users_google',
});

module.exports = UserGoogle;

