'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('assignmentresponses', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      assignmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'assignments', key: 'id' },
        onDelete: 'CASCADE',
      },
      batchId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'batches', key: 'id' },
        onDelete: 'CASCADE',
      },
      enquiryId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'enquiries', key: 'id' },
        onDelete: 'CASCADE',
      },
      submittedOn: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      submissionNotes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      submissionFile: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('assigned', 'submitted', 'reviewed'),
        defaultValue: 'assigned',
      },
      reviewedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
      },
      reviewedOn: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      instructorComments: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    await queryInterface.dropTable('assignmentresponses');
  },
};
