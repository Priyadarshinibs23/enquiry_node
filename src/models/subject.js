module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Subject',
    {
      name: DataTypes.STRING,
      code:DataTypes.STRING,
    },
    {
      tableName: 'subjects',
      freezeTableName: true,
    }
  );
};
