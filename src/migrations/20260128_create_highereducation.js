'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('highereducations', {
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
      degree: Sequelize.STRING,
      fieldOfStudy: Sequelize.STRING,
      institutionName: Sequelize.STRING,
      university: Sequelize.STRING,
      startYear: Sequelize.INTEGER,
      endYear: Sequelize.INTEGER,
      currentlyPursuing: Sequelize.BOOLEAN,
      resultFormat: Sequelize.ENUM('percentage', 'cgpa'),
      result: Sequelize.STRING,
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
    await queryInterface.dropTable('highereducations');
  }
};
