module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'InstructorProfile',
    {
      userId: DataTypes.INTEGER,
      subjectId: DataTypes.INTEGER,
      image: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Instructor profile image URL'
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Instructor display name'
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Instructor bio/description'
      }
    },
    {
      tableName: 'instructorsProfile',
      freezeTableName: true,
      timestamps: true
    }
  );
};
