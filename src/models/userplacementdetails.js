const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserPlacementDetail extends Model {
    static associate(models) {
      UserPlacementDetail.belongsTo(models.Enquiry, { foreignKey: 'enquiryId', as: 'enquiry' });
    }
  }
  UserPlacementDetail.init({
    enquiryId: DataTypes.INTEGER,
    bowizzyLink: DataTypes.STRING,
    firstName: DataTypes.STRING,
    middleName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    mobileNumber: DataTypes.STRING,
    languagesKnown: DataTypes.ARRAY(DataTypes.STRING),
    address: DataTypes.STRING,
    country: DataTypes.STRING,
    state: DataTypes.STRING,
    city: DataTypes.STRING,
    sslcInstitutionName: DataTypes.STRING,
    sslcBoardType: DataTypes.ENUM('state board', 'icse board', 'cbsc board'),
    sslcYearOfPassing: DataTypes.INTEGER,
    sslcResultFormat: DataTypes.ENUM('percentage', 'cgpa'),
    sslcResult: DataTypes.STRING,

    pucInstitutionName: DataTypes.STRING,
    pucBoardType: DataTypes.ENUM('state board', 'icse board', 'cbsc board'),
    pucSubjectStream: DataTypes.STRING,
    pucYearOfPassing: DataTypes.INTEGER,
    pucResultFormat: DataTypes.ENUM('percentage', 'cgpa'),
    pucResult: DataTypes.STRING,
    technicalSkills: DataTypes.ARRAY(DataTypes.STRING),
    softSkills: DataTypes.ARRAY(DataTypes.STRING),
    linkedinProfile: DataTypes.STRING,
    githubProfile: DataTypes.STRING,
    portfolioUrl: DataTypes.STRING,
    portfolioDescription: DataTypes.TEXT,
    publicationUrl: DataTypes.STRING,
    technicalSummary: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'UserPlacementDetail',
    tableName: 'userplacementdetails'
  });
  return UserPlacementDetail;
};
