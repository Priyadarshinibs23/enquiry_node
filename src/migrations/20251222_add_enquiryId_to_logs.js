"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add enquiryId column
    await queryInterface.addColumn('logs', 'enquiryId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'enquiries',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove enquiryId column
    await queryInterface.removeColumn('logs', 'enquiryId');
  },
};
