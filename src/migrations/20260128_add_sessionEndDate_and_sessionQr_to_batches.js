"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("batches", "sessionEndDate", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn("batches", "sessionQr", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("batches", "sessionEndDate");
    await queryInterface.removeColumn("batches", "sessionQr");
  },
};
