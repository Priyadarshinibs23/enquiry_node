"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add sessionEndDate if missing
    const table = await queryInterface.describeTable("batches");
    if (!table.sessionEndDate) {
      await queryInterface.addColumn("batches", "sessionEndDate", {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
    // Add sessionQr if missing
    if (!table.sessionQr) {
      await queryInterface.addColumn("batches", "sessionQr", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove sessionEndDate if exists
    const table = await queryInterface.describeTable("batches");
    if (table.sessionEndDate) {
      await queryInterface.removeColumn("batches", "sessionEndDate");
    }
    // Remove sessionQr if exists
    if (table.sessionQr) {
      await queryInterface.removeColumn("batches", "sessionQr");
    }
  },
};
