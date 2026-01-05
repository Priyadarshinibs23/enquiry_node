module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'BatchStudent',
    {
      batchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'batches', key: 'id' },
        onDelete: 'CASCADE',
      },
      enquiryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'enquiries', key: 'id' },
        onDelete: 'CASCADE',
      },
    },
    {
      tableName: 'batchstudents',
      freezeTableName: true,
    }
  );
};
