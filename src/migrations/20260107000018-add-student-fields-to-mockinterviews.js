'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Check if studentName column exists
      const hasStudentName = await queryInterface.describeTable('mockInterviews').then(table => {
        return table.hasOwnProperty('studentName');
      }).catch(() => false);

      if (!hasStudentName) {
        await queryInterface.addColumn('mockInterviews', 'studentName', {
          type: Sequelize.STRING(100),
          allowNull: false,
          defaultValue: '',
        });
        console.log('Added studentName column to mockInterviews table');
      } else {
        console.log('studentName column already exists in mockInterviews table');
      }

      // Check if studentEmail column exists
      const hasStudentEmail = await queryInterface.describeTable('mockInterviews').then(table => {
        return table.hasOwnProperty('studentEmail');
      }).catch(() => false);

      if (!hasStudentEmail) {
        await queryInterface.addColumn('mockInterviews', 'studentEmail', {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '',
        });
        console.log('Added studentEmail column to mockInterviews table');
      } else {
        console.log('studentEmail column already exists in mockInterviews table');
      }

      console.log('Migration completed successfully');
    } catch (error) {
      console.error('Error in migration up:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Check if studentName column exists before removing
      const hasStudentName = await queryInterface.describeTable('mockInterviews').then(table => {
        return table.hasOwnProperty('studentName');
      }).catch(() => false);

      if (hasStudentName) {
        await queryInterface.removeColumn('mockInterviews', 'studentName');
        console.log('Removed studentName column from mockInterviews table');
      }

      // Check if studentEmail column exists before removing
      const hasStudentEmail = await queryInterface.describeTable('mockInterviews').then(table => {
        return table.hasOwnProperty('studentEmail');
      }).catch(() => false);

      if (hasStudentEmail) {
        await queryInterface.removeColumn('mockInterviews', 'studentEmail');
        console.log('Removed studentEmail column from mockInterviews table');
      }

      console.log('Migration rollback completed successfully');
    } catch (error) {
      console.error('Error in migration down:', error);
      throw error;
    }
  },
};
