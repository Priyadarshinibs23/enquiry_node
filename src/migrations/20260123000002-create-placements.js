'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('placements', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      enquiryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'enquiries', key: 'id' },
        onDelete: 'CASCADE'
      },
      bowizzyLink: { type: Sequelize.STRING },
      firstName: { type: Sequelize.STRING },
      middleName: { type: Sequelize.STRING },
      lastName: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING },
      mobileNumber: { type: Sequelize.STRING },
      languagesKnown: { type: Sequelize.ARRAY(Sequelize.STRING), defaultValue: [] },
      address: { type: Sequelize.STRING },
      country: { type: Sequelize.STRING },
      state: { type: Sequelize.STRING },
      city: { type: Sequelize.STRING },
      sslc: {
        type: Sequelize.JSON,
        allowNull: true // { institutionName, boardType, yearOfPassing, resultFormat, result }
      },
      puc: {
        type: Sequelize.JSON,
        allowNull: true // { institutionName, boardType, subjectStream, resultFormat, result }
      },
      higherEducation: {
        type: Sequelize.ARRAY(Sequelize.JSON),
        defaultValue: [] // [{ degree, fieldOfStudy, institutionName, universityBoard, startYear, endYear, resultFormat, result }]
      },
      workExperience: {
        type: Sequelize.ARRAY(Sequelize.JSON),
        defaultValue: [] // [{ companyName, jobTitle, employmentType, location, workMode, startDate, endDate, description }]
      },
      projects: {
        type: Sequelize.ARRAY(Sequelize.JSON),
        defaultValue: [] // [{ projectTitle, projectType, startDate, endDate, description, rolesResponsibilities }]
      },
      technicalSkills: { type: Sequelize.ARRAY(Sequelize.STRING), defaultValue: [] },
      softSkills: { type: Sequelize.ARRAY(Sequelize.STRING), defaultValue: [] },
      linkedinProfile: { type: Sequelize.STRING },
      githubProfile: { type: Sequelize.STRING },
      portfolioUrl: { type: Sequelize.STRING },
      portfolioDescription: { type: Sequelize.TEXT },
      publicationUrl: { type: Sequelize.STRING },
      technicalSummary: { type: Sequelize.TEXT },
      certifications: {
        type: Sequelize.ARRAY(Sequelize.JSON),
        defaultValue: [] // [{ title, startDate, endDate, domain, provider, description, certificateImage }]
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('placements');
  }
};
