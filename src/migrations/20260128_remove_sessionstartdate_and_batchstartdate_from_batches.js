"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const batchTable = await queryInterface.describeTable("batches");
    if (batchTable.sessionStartDate) {
      await queryInterface.removeColumn("batches", "sessionStartDate");
    }
    if (batchTable.batchStartDate) {
      await queryInterface.removeColumn("batches", "batchStartDate");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const batchTable = await queryInterface.describeTable("batches");
    if (!batchTable.sessionStartDate) {
      await queryInterface.addColumn("batches", "sessionStartDate", {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
    if (!batchTable.batchStartDate) {
      await queryInterface.addColumn("batches", "batchStartDate", {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
  },
};
