module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Log',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      enquiryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'enquiries',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    },
    {
      tableName: 'logs',
      freezeTableName: true,
      timestamps: true,
    }
  );
};
