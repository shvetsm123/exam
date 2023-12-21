module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Offers', 'moderStatus', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'pending',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Offers', 'moderStatus');
  },
};
