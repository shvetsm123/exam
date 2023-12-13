const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Catalog extends Model {
    static associate({ User, Conversation, CatalogChat }) {
      Catalog.belongsTo(User, {
        foreignKey: 'userId',
        sourceKey: 'id',
      });
      Catalog.hasMany(CatalogChat, {
        foreignKey: 'catalogId',
        sourceKey: 'id',
        as: 'catalogChats',
      });
      Catalog.belongsToMany(Conversation, {
        through: CatalogChat,
        foreignKey: 'catalogId',
        otherKey: 'conversationId',
        as: 'conversations',
      });
    }
  }

  Catalog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      catalogName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Catalog',
    }
  );

  return Catalog;
};
