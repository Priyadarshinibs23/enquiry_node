const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Certification extends Model {
    static associate(models) {
      Certification.belongsTo(models.UserPlacementDetail, { foreignKey: 'userPlacementDetailId', as: 'userPlacementDetail' });
    }
  }
  Certification.init({
    userPlacementDetailId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'userplacementdetails',
        key: 'id'
      }
    },
    certificateTitle: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    domain: DataTypes.STRING,
    certificateProvidedBy: DataTypes.STRING,
    description: DataTypes.TEXT,
    certificateImage: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Certification',
    tableName: 'certifications'
  });
  return Certification;
};
