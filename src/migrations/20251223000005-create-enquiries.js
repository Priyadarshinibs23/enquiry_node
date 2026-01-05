'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
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
      packageId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'packages', key: 'id' },
        onDelete: 'SET NULL',
      },
      batchId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'batches', key: 'id' },
        onDelete: 'SET NULL',
      },
      subjectIds: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
        defaultValue: [],
      },
      trainingMode: {
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
      candidateStatus: {
        type: Sequelize.ENUM('demo', 'qualified demo', 'class', 'class qualified', 'placement', 'enquiry stage'),
        allowNull: false,
        defaultValue: 'demo',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('enquiries');
  },
};
