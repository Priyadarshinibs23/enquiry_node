module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'MockInterview',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      batchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'batches', key: 'id' },
        onDelete: 'CASCADE',
      },
      enquiryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'enquiries', key: 'id' },
        onDelete: 'CASCADE',
      },
      instructorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      studentName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      studentEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      interviewDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      interviewTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      mode: {
        type: DataTypes.ENUM('online', 'offline'),
        allowNull: false,
      },
      interviewLink: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      documentUpload: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('scheduled', 'attended', 'not-attended', 'cancelled'),
        defaultValue: 'scheduled',
        allowNull: false,
      },
      feedback: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 10,
        },
      },
      outOf: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'mockInterviews',
      timestamps: true,
    }
  );
};
