module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Instructor',
    {
      userId: DataTypes.INTEGER,
      subjectId: DataTypes.INTEGER,
    },
    {
      tableName: 'instructors',
      freezeTableName: true,
    }
  );
};
