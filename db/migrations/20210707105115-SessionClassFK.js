'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Sessions', 'classId', Sequelize.INTEGER, {
      allowNull: false,
      references: {
        model: {
          tableName: 'Classes',
        },
        key: 'id',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Sessions', 'classId');
  },
};
