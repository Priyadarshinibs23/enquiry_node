"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Attendance table: ensure only attendanceCount exists
    const attendanceTable = await queryInterface.describeTable("attendances");
    if (!attendanceTable.attendanceCount) {
      await queryInterface.addColumn("attendances", "attendanceCount", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
    if (attendanceTable.attended) {
      await queryInterface.removeColumn("attendances", "attended");
    }
    if (attendanceTable.qrSessionId) {
      await queryInterface.removeColumn("attendances", "qrSessionId");
    }
    if (attendanceTable.sessionDate) {
      await queryInterface.removeColumn("attendances", "sessionDate");
    }

    // Batch table: ensure sessionQr, sessionStartDate, sessionEndDate exist
    const batchTable = await queryInterface.describeTable("batches");
    if (!batchTable.sessionQr) {
      await queryInterface.addColumn("batches", "sessionQr", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (!batchTable.sessionStartDate) {
      await queryInterface.addColumn("batches", "sessionStartDate", {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
    if (!batchTable.sessionEndDate) {
      await queryInterface.addColumn("batches", "sessionEndDate", {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Attendance table: revert to attended (boolean) and qrSessionId, remove attendanceCount
    const attendanceTable = await queryInterface.describeTable("attendances");
    if (!attendanceTable.attended) {
      await queryInterface.addColumn("attendances", "attended", {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      });
    }
    if (!attendanceTable.qrSessionId) {
      await queryInterface.addColumn("attendances", "qrSessionId", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (attendanceTable.attendanceCount) {
      await queryInterface.removeColumn("attendances", "attendanceCount");
    }

    // Batch table: remove sessionQr, sessionStartDate, sessionEndDate
    const batchTable = await queryInterface.describeTable("batches");
    if (batchTable.sessionQr) {
      await queryInterface.removeColumn("batches", "sessionQr");
    }
    if (batchTable.sessionStartDate) {
      await queryInterface.removeColumn("batches", "sessionStartDate");
    }
    if (batchTable.sessionEndDate) {
      await queryInterface.removeColumn("batches", "sessionEndDate");
    }
  },
};
