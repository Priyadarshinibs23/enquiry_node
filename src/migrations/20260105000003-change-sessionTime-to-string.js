'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Alter sessionTime column from TIME to STRING
      await queryInterface.changeColumn('batches', 'sessionTime', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Session time as string (e.g., "10:00 AM - 11:30 AM" or "14:30")'
      });
      console.log('Successfully changed sessionTime column type from TIME to STRING');
    } catch (error) {
      console.error('Error changing sessionTime column:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Revert back to TIME type
      await queryInterface.changeColumn('batches', 'sessionTime', {
        type: Sequelize.TIME,
        allowNull: true
      });
    } catch (error) {
      console.error('Error reverting sessionTime column:', error);
      throw error;
    }
  }
};
