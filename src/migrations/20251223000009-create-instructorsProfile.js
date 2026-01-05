'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('instructorsProfile', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
      },
      subjectId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'subjects', key: 'id' },
        onDelete: 'SET NULL',
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Instructor profile image URL',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Instructor display name',
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Instructor bio/description',
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
    await queryInterface.dropTable('instructorsProfile');
  },
};
