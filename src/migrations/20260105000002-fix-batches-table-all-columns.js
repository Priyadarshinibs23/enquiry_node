'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Get current table structure
      const table = await queryInterface.describeTable('batches');
      
      // Add all missing columns
      const columnsToAdd = [];

      if (!table.numberOfStudents) {
        columnsToAdd.push(
          queryInterface.addColumn('batches', 'numberOfStudents', {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
          })
        );
      }

      if (!table.approvalStatus) {
        columnsToAdd.push(
          queryInterface.addColumn('batches', 'approvalStatus', {
            type: Sequelize.ENUM('pending', 'approved', 'rejected'),
            allowNull: true,
            defaultValue: 'pending',
          })
        );
      }

      if (!table.subjectId) {
        columnsToAdd.push(
          queryInterface.addColumn('batches', 'subjectId', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: 'subjects', key: 'id' },
            onDelete: 'CASCADE',
          })
        );
      }

      if (!table.createdBy) {
        columnsToAdd.push(
          queryInterface.addColumn('batches', 'createdBy', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: 'users', key: 'id' },
            onDelete: 'SET NULL',
          })
        );
      }

      if (!table.sessionTime) {
        columnsToAdd.push(
          queryInterface.addColumn('batches', 'sessionTime', {
            type: Sequelize.TIME,
            allowNull: true,
          })
        );
      }

      if (!table.sessionDate) {
        columnsToAdd.push(
          queryInterface.addColumn('batches', 'sessionDate', {
            type: Sequelize.DATE,
            allowNull: true,
          })
        );
      }

      if (!table.sessionLink) {
        columnsToAdd.push(
          queryInterface.addColumn('batches', 'sessionLink', {
            type: Sequelize.STRING,
            allowNull: true,
          })
        );
      }

      if (!table.batchStartDate) {
        columnsToAdd.push(
          queryInterface.addColumn('batches', 'batchStartDate', {
            type: Sequelize.DATE,
            allowNull: true,
          })
        );
      }

      // Execute all column additions in parallel
      if (columnsToAdd.length > 0) {
        await Promise.all(columnsToAdd);
        console.log(`Added ${columnsToAdd.length} missing columns to batches table`);
      } else {
        console.log('All required columns already exist in batches table');
      }
    } catch (error) {
      console.error('Error in migration:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      const table = await queryInterface.describeTable('batches');
      const columnsToRemove = [];

      if (table.numberOfStudents) columnsToRemove.push(queryInterface.removeColumn('batches', 'numberOfStudents'));
      if (table.approvalStatus) columnsToRemove.push(queryInterface.removeColumn('batches', 'approvalStatus'));
      if (table.subjectId) columnsToRemove.push(queryInterface.removeColumn('batches', 'subjectId'));
      if (table.createdBy) columnsToRemove.push(queryInterface.removeColumn('batches', 'createdBy'));
      if (table.sessionTime) columnsToRemove.push(queryInterface.removeColumn('batches', 'sessionTime'));
      if (table.sessionDate) columnsToRemove.push(queryInterface.removeColumn('batches', 'sessionDate'));
      if (table.sessionLink) columnsToRemove.push(queryInterface.removeColumn('batches', 'sessionLink'));
      if (table.batchStartDate) columnsToRemove.push(queryInterface.removeColumn('batches', 'batchStartDate'));

      if (columnsToRemove.length > 0) {
        await Promise.all(columnsToRemove);
      }
    } catch (error) {
      console.error('Error in rollback:', error);
      throw error;
    }
  }
};
