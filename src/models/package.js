module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Package',
    {
      name: DataTypes.STRING,
      code: DataTypes.STRING,
      subjectId: DataTypes.INTEGER,
    },
    {
      tableName: 'packages',
      freezeTableName: true,
    }
  );
};
