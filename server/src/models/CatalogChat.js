const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CatalogChat extends Model {
    static associate({ Catalog, Conversation }) {
      CatalogChat.belongsTo(Catalog, {
        foreignKey: 'catalogId',
        sourceKey: 'id',
      });
      CatalogChat.belongsTo(Conversation, {
        foreignKey: 'conversationId',
        sourceKey: 'id',
        as: 'conversation',
      });
    }
  }

  CatalogChat.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      catalogId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'CatalogChat',
    }
  );

  return CatalogChat;
};
