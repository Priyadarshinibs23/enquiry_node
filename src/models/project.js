const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      Project.belongsTo(models.UserPlacementDetail, { foreignKey: 'userPlacementDetailId', as: 'userPlacementDetail' });
    }
  }
  Project.init({
    userPlacementDetailId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'userplacementdetails',
        key: 'id'
      }
    },
    projectTitle: DataTypes.STRING,
    projectType: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    currentlyWorking: DataTypes.BOOLEAN,
    description: DataTypes.TEXT,
    rolesAndResponsibilities: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Project',
    tableName: 'projects'
  });
  return Project;
};
