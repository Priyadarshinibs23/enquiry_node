'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userPlacementDetailId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'userplacementdetails',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      projectTitle: Sequelize.STRING,
      projectType: Sequelize.STRING,
      startDate: Sequelize.DATE,
      endDate: Sequelize.DATE,
      currentlyWorking: Sequelize.BOOLEAN,
      description: Sequelize.TEXT,
      rolesAndResponsibilities: Sequelize.TEXT,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('projects');
  }
};
