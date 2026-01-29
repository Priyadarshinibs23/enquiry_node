const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    static associate(models) {
      Attendance.belongsTo(models.Enquiry, { foreignKey: 'enquiryId' });
      Attendance.belongsTo(models.Batch, { foreignKey: 'batchId' });
      Attendance.belongsTo(models.Subject, { foreignKey: 'subjectId' });
      Attendance.belongsTo(models.User, { as: 'instructor', foreignKey: 'instructorId' });
    }
  }
  Attendance.init({
    enquiryId: DataTypes.INTEGER,
    batchId: DataTypes.INTEGER,
    subjectId: DataTypes.INTEGER,
    instructorId: DataTypes.INTEGER,
    attendanceCount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Attendance',
    tableName: 'attendances'
  });
  return Attendance;
};
