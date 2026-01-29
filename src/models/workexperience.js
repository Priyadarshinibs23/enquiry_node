const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class WorkExperience extends Model {
    static associate(models) {
      WorkExperience.belongsTo(models.UserPlacementDetail, { foreignKey: 'userPlacementDetailId', as: 'userPlacementDetail' });
    }
  }
  WorkExperience.init({
    userPlacementDetailId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'userplacementdetails',
        key: 'id'
      }
    },
    companyName: DataTypes.STRING,
    jobTitle: DataTypes.STRING,
    employmentType: DataTypes.STRING,
    location: DataTypes.STRING,
    workMode: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    currentlyWorkingHere: DataTypes.BOOLEAN,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'WorkExperience',
    tableName: 'workexperiences'
  });
  return WorkExperience;
};
