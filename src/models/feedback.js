module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Feedback',
    {
      enquiryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'enquiries', key: 'id' },
      },
      instructorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      batchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'batches', key: 'id' },
      },
      feedbackText: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true,
        defaultValue: [],
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'feedbacks',
      freezeTableName: true,
    }
  );
};
