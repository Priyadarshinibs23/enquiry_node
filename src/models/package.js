module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Package',
    {
      name: DataTypes.STRING,
      code: DataTypes.STRING,
    },
    {
      tableName: 'packages',
      freezeTableName: true,
    }
  );
};
