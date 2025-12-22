"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('enquiries', 'candidateStatus', {
      type: Sequelize.ENUM('demo', 'qualified demo', 'class', 'class qualified', 'placement'),
      allowNull: false,
      defaultValue: 'demo',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('enquiries', 'candidateStatus');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_enquiries_candidateStatus";');
  },
};
