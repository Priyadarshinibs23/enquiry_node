module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Batch',
    {
      name: DataTypes.STRING,
      code: DataTypes.STRING,
      status: DataTypes.ENUM('yet to start', 'In progress', 'completed'),
      batchStartDate: DataTypes.DATE,
      sessionLink: DataTypes.STRING,
      sessionDate: DataTypes.DATE,
      sessionTime: DataTypes.STRING,
      numberOfStudents: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      approvalStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: true,
        defaultValue: 'pending',
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
      },
      subjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'subjects', key: 'id' },
      },
    },
    {
      tableName: 'batches',
      freezeTableName: true,
    }
  );
};
