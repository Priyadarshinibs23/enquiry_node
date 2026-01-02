'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    // USERS
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: true },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      role: { type: Sequelize.ENUM('ADMIN', 'HR', 'COUNSELLOR', 'ACCOUNTS', 'instructor'), defaultValue: 'ADMIN' },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    // SUBJECTS
    await queryInterface.createTable('subjects', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      code: { type: Sequelize.STRING, allowNull: true },
      image: { type: Sequelize.STRING, allowNull: true },
      overview: { type: Sequelize.JSON, allowNull: true },
      syllabus: { type: Sequelize.JSON, allowNull: true },
      prerequisites: { type: Sequelize.JSON, allowNull: true },
      startDate: { type: Sequelize.DATE, allowNull: true },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    // PACKAGES
    await queryInterface.createTable('packages', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: Sequelize.STRING,
      code: Sequelize.STRING,
      image: { type: Sequelize.STRING, allowNull: true },
      overview: { type: Sequelize.JSON, allowNull: true },
      syllabus: { type: Sequelize.JSON, allowNull: true },
      prerequisites: { type: Sequelize.JSON, allowNull: true },
      startDate: { type: Sequelize.DATE, allowNull: true },
      subjectIds: { type: Sequelize.ARRAY(Sequelize.INTEGER), allowNull: true, defaultValue: [] },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    // ENQUIRIES
    await queryInterface.createTable('enquiries', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      name: { type: Sequelize.STRING(100), allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false },
      phone: { type: Sequelize.STRING(20), allowNull: true },
      current_location: { type: Sequelize.STRING(100), allowNull: true },
      // package: removed, replaced below
      timing: { type: Sequelize.STRING(50), allowNull: true },
      trainingTime: { type: Sequelize.STRING(50), allowNull: true },
      startTime: { type: Sequelize.STRING(50), allowNull: true },
      profession: { type: Sequelize.STRING(100), allowNull: true },
      qualification: { type: Sequelize.STRING(100), allowNull: true },
      experience: { type: Sequelize.STRING(50), allowNull: true },
      referral: { type: Sequelize.STRING(100), allowNull: true },
      consent: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
    });
    // Add unique constraints to enquiries
    await queryInterface.addConstraint('enquiries', { fields: ['email'], type: 'unique', name: 'enquiries_email_unique' });
    await queryInterface.addConstraint('enquiries', { fields: ['phone'], type: 'unique', name: 'enquiries_phone_unique' });

    // Add candidateStatus ENUM to enquiries
    await queryInterface.addColumn('enquiries', 'candidateStatus', {
      type: Sequelize.ENUM('demo', 'qualified demo', 'class', 'class qualified', 'placement'),
      allowNull: false,
      defaultValue: 'demo',
    });
    // Add enquiryStage to enquiries
    await queryInterface.addColumn('enquiries', 'enquiryStage', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    // Remove old 'package' column, add packageId and subjectIds
    await queryInterface.addColumn('enquiries', 'packageId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'packages', key: 'id' },
    });
    await queryInterface.addColumn('enquiries', 'subjectIds', {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: true,
      defaultValue: [],
    });
    // Remove old 'timing' column if it exists, add trainingMode
    await queryInterface.removeColumn('enquiries', 'timing').catch(() => {});
    await queryInterface.addColumn('enquiries', 'trainingMode', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    // Add enum value 'enquiry stage' to candidateStatus (Postgres only, may error if not needed)
    await queryInterface.sequelize.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_enquiries_candidateStatus') THEN CREATE TYPE "enum_enquiries_candidateStatus" AS ENUM ('demo', 'qualified demo', 'class', 'class qualified', 'placement', 'enquiry stage'); END IF; END $$;`
    ).catch(() => {});

    // BILLINGS
    await queryInterface.createTable('billings', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      enquiryId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'enquiries', key: 'id' }, onDelete: 'CASCADE' },
      packageCost: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      amountPaid: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      discount: { type: Sequelize.DECIMAL(10, 2), allowNull: true, defaultValue: 0 },
      balance: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    // LOGS
    await queryInterface.createTable('logs', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: Sequelize.STRING(255), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    // Add enquiryId to logs
    await queryInterface.addColumn('logs', 'enquiryId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'enquiries', key: 'id' },
      onDelete: 'CASCADE',
    });

    // PackageSubjects join table
    await queryInterface.createTable('PackageSubjects', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      packageId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'packages', key: 'id' }, onDelete: 'CASCADE' },
      subjectId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'subjects', key: 'id' }, onDelete: 'CASCADE' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop all tables and columns in reverse order
    await queryInterface.dropTable('PackageSubjects');
    await queryInterface.removeColumn('logs', 'enquiryId');
    await queryInterface.dropTable('logs');
    await queryInterface.dropTable('billings');
    await queryInterface.removeColumn('enquiries', 'trainingMode');
    await queryInterface.removeColumn('enquiries', 'subjectIds');
    await queryInterface.removeColumn('enquiries', 'packageId');
    await queryInterface.removeColumn('enquiries', 'enquiryStage');
    await queryInterface.removeColumn('enquiries', 'candidateStatus');
    await queryInterface.removeConstraint('enquiries', 'enquiries_email_unique');
    await queryInterface.removeConstraint('enquiries', 'enquiries_phone_unique');
    await queryInterface.dropTable('enquiries');
    await queryInterface.dropTable('packages');
    await queryInterface.dropTable('subjects');
    await queryInterface.dropTable('users');
    // Remove ENUM types if exist (Postgres)
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_enquiries_candidateStatus";').catch(() => {});
  }
};
