module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Review',
    {
      username: DataTypes.STRING,
      image: DataTypes.STRING,
      comment: DataTypes.TEXT,
      rating: DataTypes.FLOAT,
      subjectId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'subjects', key: 'id' },
      },
      packageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'packages', key: 'id' },
      },
    },
    {
      tableName: 'reviews',
      freezeTableName: true,
    }
  );
};
