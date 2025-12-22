"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add the new enum value 'enquiry stage' to the candidateStatus enum
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_enquiries_candidateStatus" ADD VALUE 'enquiry stage' AFTER 'placement'`
    );
  },

  async down(queryInterface, Sequelize) {
    // Note: PostgreSQL does not support removing enum values, so we'll just do nothing on rollback
    // If you need to rollback, you'll need to drop and recreate the type manually
  },
};
