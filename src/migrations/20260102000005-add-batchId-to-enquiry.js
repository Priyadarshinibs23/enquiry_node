'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('enquiries', 'batchId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'batches',
        key: 'id'
      },
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('enquiries', 'batchId');
  }
};
