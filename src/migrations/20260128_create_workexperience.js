'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('workexperiences', {
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
      companyName: Sequelize.STRING,
      jobTitle: Sequelize.STRING,
      employmentType: Sequelize.STRING,
      location: Sequelize.STRING,
      workMode: Sequelize.STRING,
      startDate: Sequelize.DATE,
      endDate: Sequelize.DATE,
      currentlyWorkingHere: Sequelize.BOOLEAN,
      description: Sequelize.TEXT,
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
    await queryInterface.dropTable('workexperiences');
  }
};
