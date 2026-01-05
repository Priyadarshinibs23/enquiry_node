module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Assignment',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      assignmentFile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      batchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'batches', key: 'id' },
      },
      subjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'subjects', key: 'id' },
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
    },
    {
      tableName: 'assignments',
      freezeTableName: true,
    }
  );
};
