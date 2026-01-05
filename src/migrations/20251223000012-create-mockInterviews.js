'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('mockInterviews', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      batchId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'batches', key: 'id' },
        onDelete: 'CASCADE',
      },
      enquiryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'enquiries', key: 'id' },
        onDelete: 'CASCADE',
      },
      instructorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      interviewDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      interviewTime: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      mode: {
        type: Sequelize.ENUM('online', 'offline'),
        allowNull: false,
      },
      interviewLink: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      documentUpload: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('scheduled', 'attended', 'not-attended', 'cancelled'),
        defaultValue: 'scheduled',
        allowNull: false,
      },
      feedback: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 10,
        },
      },
      outOf: {
        type: Sequelize.INTEGER,
        defaultValue: 10,
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
    await queryInterface.dropTable('mockInterviews');
  },
};
