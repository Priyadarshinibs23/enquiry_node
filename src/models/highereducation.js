const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class HigherEducation extends Model {
    static associate(models) {
      HigherEducation.belongsTo(models.UserPlacementDetail, { foreignKey: 'userPlacementDetailId', as: 'userPlacementDetail' });
    }
  }
  HigherEducation.init({
    userPlacementDetailId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'userplacementdetails',
        key: 'id'
      }
    },
    degree: DataTypes.STRING,
    fieldOfStudy: DataTypes.STRING,
    institutionName: DataTypes.STRING,
    university: DataTypes.STRING,
    startYear: DataTypes.INTEGER,
    endYear: DataTypes.INTEGER,
    currentlyPursuing: DataTypes.BOOLEAN,
    resultFormat: DataTypes.ENUM('percentage', 'cgpa'),
    result: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'HigherEducation',
    tableName: 'highereducations'
  });
  return HigherEducation;
};
