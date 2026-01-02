'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // This migration is now handled in the initial migration
    // Column 'name' is added to users table in the initial migration
  },

  async down(queryInterface, Sequelize) {
    // Rollback handled by initial migration
  }
};
