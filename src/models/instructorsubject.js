module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'InstructorSubject',
    {
      instructorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
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
      tableName: 'InstructorSubjects',
      freezeTableName: true,
    }
  );
};
