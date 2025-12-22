module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Enquiry',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      current_location: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      packageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'packages',
          key: 'id',
        },
      },
      subjectIds: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
        defaultValue: [],
      },
      timing: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      trainingTime: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      startTime: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      profession: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      qualification: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      experience: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      referral: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      consent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'enquiries',
      freezeTableName: true,
    }
  );
};
