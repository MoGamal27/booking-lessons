const { Model, DataTypes } = require('sequelize');
const sequelize = require('../Config/connectDB');

class Token extends Model {}

Token.init({
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        }
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Token',
    tableName: 'tokens',
});

module.exports = Token;