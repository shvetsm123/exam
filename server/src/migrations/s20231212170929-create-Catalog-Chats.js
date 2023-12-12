module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CatalogChats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      catalogId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Catalogs',
          key: 'id',
        },
      },
      conversationId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Conversations',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('CatalogChats');
  },
};
