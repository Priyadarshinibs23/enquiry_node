module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Billing',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      packageCost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      amountPaid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
      },
      balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: 'billings',
      freezeTableName: true,
      timestamps: true,
    }
  );
};
