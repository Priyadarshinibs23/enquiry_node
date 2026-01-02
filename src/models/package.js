module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Package',
    {
      name: DataTypes.STRING,
      code: DataTypes.STRING,
      image: DataTypes.STRING,
      overview: DataTypes.JSON,
      syllabus: DataTypes.JSON,
      prerequisites: DataTypes.JSON,
      startDate: DataTypes.DATE,
    },
    {
      tableName: 'packages',
      freezeTableName: true,
    }
  );
};
