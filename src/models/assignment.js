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
      enquiryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'enquiries', key: 'id' },
      },
      submittedOn: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      submissionNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      submissionFile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('assigned', 'submitted', 'reviewed'),
        defaultValue: 'assigned',
      },
      reviewedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
      },
      reviewedOn: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      instructorComments: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'assignments',
      freezeTableName: true,
    }
  );
};
