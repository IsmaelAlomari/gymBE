'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Classes', 'gymId', Sequelize.INTEGER, {
      allowNull: false,
      references: {
        model: {
          tableName: 'Gyms',
        },
        key: 'id',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Classes', 'gymId');
  },
};
