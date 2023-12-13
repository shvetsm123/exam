const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    static associate({ CatalogChat, Message, Catalog }) {
      Conversation.belongsToMany(Catalog, {
        through: CatalogChat,
        foreignKey: 'conversationId',
        sourceKey: 'id',
      });
      Conversation.hasMany(Message, {
        foreignKey: 'conversationId',
        sourceKey: 'id',
        as: 'messages',
      });
    }
  }

  Conversation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      participants: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
      },
      blackList: {
        type: DataTypes.ARRAY(DataTypes.BOOLEAN),
        allowNull: false,
      },
      favoriteList: {
        type: DataTypes.ARRAY(DataTypes.BOOLEAN),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Conversation',
    }
  );

  return Conversation;
};
