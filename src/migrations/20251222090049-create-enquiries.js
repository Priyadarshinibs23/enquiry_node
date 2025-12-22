'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('enquiries', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },

      current_location: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      package: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      timing: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },

      trainingTime: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },

      startTime: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },

      profession: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      qualification: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      experience: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },

      referral: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      consent: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('enquiries');
  },
};
