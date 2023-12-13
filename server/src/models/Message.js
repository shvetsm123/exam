const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate({ User, Conversation }) {
      Message.belongsTo(User, {
        foreignKey: 'sender',
        sourceKey: 'id',
        as: 'senderData',
      });
      Message.belongsTo(Conversation, {
        foreignKey: 'conversationId',
        sourceKey: 'id',
        as: 'conversationData',
      });
    }
  }

  Message.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sender: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      conversationId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Message',
      timestamps: true,
    }
  );

  return Message;
};
