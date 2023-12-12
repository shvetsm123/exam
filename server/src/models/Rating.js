const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    static associate({ User, Offer }) {
      Rating.belongsTo(User, { foreignKey: 'userId', sourceKey: 'id' });
      Rating.belongsTo(Offer, { foreignKey: 'offerId', sourceKey: 'id' });
    }
  }

  Rating.init(
    {
      offerId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      mark: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 5,
        },
      },
    },
    {
      sequelize,
      modelName: 'Rating',
      timestamps: false,
    }
  );

  return Rating;
};
