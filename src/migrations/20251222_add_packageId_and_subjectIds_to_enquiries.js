"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove old 'package' column
    await queryInterface.removeColumn('enquiries', 'package');
    // Add new 'packageId' column
    await queryInterface.addColumn('enquiries', 'packageId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'packages',
        key: 'id',
      },
    });
    // Add new 'subjectIds' column
    await queryInterface.addColumn('enquiries', 'subjectIds', {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: true,
      defaultValue: [],
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove new columns
    await queryInterface.removeColumn('enquiries', 'packageId');
    await queryInterface.removeColumn('enquiries', 'subjectIds');
    // Restore old 'package' column
    await queryInterface.addColumn('enquiries', 'package', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
  },
};
