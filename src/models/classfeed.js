module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'ClassFeed',
    {
      type: {
        type: DataTypes.ENUM('announcement', 'mock interview', 'materials', 'assignment'),
        allowNull: false,
      },
      batchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'batches', key: 'id' },
        onDelete: 'CASCADE',
      },
      subjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'subjects', key: 'id' },
        onDelete: 'CASCADE',
      },
    },
    {
      tableName: 'classfeeds',
      freezeTableName: true,
    }
  );
};
