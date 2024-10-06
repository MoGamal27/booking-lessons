const { Model, DataTypes } = require('sequelize');
const sequelize = require('../Config/connectDB');


class ChatMessage extends Model {}


ChatMessage.init({
    senderId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        field: 'sender_id',
      },
      receiverId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        field: 'receiver_id',
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'ChatMessage',
      tableName: 'chat_messages',
    });
    
    module.exports = ChatMessage;