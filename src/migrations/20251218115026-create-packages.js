'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('packages', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: Sequelize.STRING,
      code: Sequelize.STRING,
      subjectId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'subjects',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('packages');
  },
};
