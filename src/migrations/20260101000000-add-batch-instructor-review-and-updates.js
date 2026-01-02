module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Create Review table with Subject and Package relationships
      await queryInterface.createTable(
        'reviews',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          username: {
            type: Sequelize.STRING,
          },
          image: {
            type: Sequelize.STRING,
          },
          comment: {
            type: Sequelize.TEXT,
          },
          rating: {
            type: Sequelize.FLOAT,
          },
          subjectId: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: 'subjects', key: 'id' },
            onDelete: 'CASCADE',
          },
          packageId: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: 'packages', key: 'id' },
            onDelete: 'CASCADE',
          },
          createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
          },
          updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
          },
        },
        { transaction }
      );

      // Create Batch table with Subject relationship
      await queryInterface.createTable(
        'batches',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          name: {
            type: Sequelize.STRING,
          },
          code: {
            type: Sequelize.STRING,
          },
          status: {
            type: Sequelize.ENUM('yet to start', 'In progress', 'completed'),
          },
          batchStartDate: {
            type: Sequelize.DATE,
          },
          sessionLink: {
            type: Sequelize.STRING,
          },
          sessionDate: {
            type: Sequelize.DATE,
          },
          sessionTime: {
            type: Sequelize.TIME,
          },
          numberOfStudents: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
          },
          approvalStatus: {
            type: Sequelize.ENUM('pending', 'approved', 'rejected'),
            allowNull: true,
            defaultValue: 'pending',
          },
          createdBy: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: 'users', key: 'id' },
          },
          subjectId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: 'subjects', key: 'id' },
            onDelete: 'CASCADE',
          },
          createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
          },
          updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
          },
        },
        { transaction }
      );

      // Add columns to subjects table
      await queryInterface.addColumn(
        'subjects',
        'image',
        {
          type: Sequelize.STRING,
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'subjects',
        'overview',
        {
          type: Sequelize.JSON,
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'subjects',
        'syllabus',
        {
          type: Sequelize.JSON,
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'subjects',
        'prerequisites',
        {
          type: Sequelize.JSON,
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'subjects',
        'startDate',
        {
          type: Sequelize.DATE,
        },
        { transaction }
      );

      // Add columns to packages table
      await queryInterface.addColumn(
        'packages',
        'image',
        {
          type: Sequelize.STRING,
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'packages',
        'overview',
        {
          type: Sequelize.JSON,
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'packages',
        'syllabus',
        {
          type: Sequelize.JSON,
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'packages',
        'prerequisites',
        {
          type: Sequelize.JSON,
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'packages',
        'startDate',
        {
          type: Sequelize.DATE,
        },
        { transaction }
      );

      // Create Instructor junction table
      await queryInterface.createTable(
        'instructors',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          userId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'users',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          subjectId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'subjects',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
          },
          updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
          },
        },
        { transaction }
      );

      // Create Assignment table with Batch and Subject relationships
      await queryInterface.createTable(
        'assignments',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          title: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          createdDate: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
          },
          dueDate: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          batchId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: 'batches', key: 'id' },
            onDelete: 'CASCADE',
          },
          subjectId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: 'subjects', key: 'id' },
            onDelete: 'CASCADE',
          },
          createdBy: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onDelete: 'CASCADE',
          },
          enquiryId: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: 'enquiries', key: 'id' },
            onDelete: 'CASCADE',
          },
          submittedOn: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          submissionNotes: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          submissionFile: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          status: {
            type: Sequelize.ENUM('assigned', 'submitted', 'reviewed'),
            defaultValue: 'assigned',
          },
          reviewedBy: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: 'users', key: 'id' },
            onDelete: 'SET NULL',
          },
          reviewedOn: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          instructorComments: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
          },
          updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
          },
        },
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Drop tables in reverse order
      await queryInterface.dropTable('assignments', { transaction });
      await queryInterface.dropTable('instructors', { transaction });
      await queryInterface.dropTable('reviews', { transaction });

      // Remove columns from packages table
      await queryInterface.removeColumn('packages', 'startDate', { transaction });
      await queryInterface.removeColumn('packages', 'prerequisites', { transaction });
      await queryInterface.removeColumn('packages', 'syllabus', { transaction });
      await queryInterface.removeColumn('packages', 'overview', { transaction });
      await queryInterface.removeColumn('packages', 'image', { transaction });

      // Remove columns from subjects table
      await queryInterface.removeColumn('subjects', 'startDate', { transaction });
      await queryInterface.removeColumn('subjects', 'prerequisites', { transaction });
      await queryInterface.removeColumn('subjects', 'syllabus', { transaction });
      await queryInterface.removeColumn('subjects', 'overview', { transaction });
      await queryInterface.removeColumn('subjects', 'image', { transaction });

      // Drop batches table
      await queryInterface.dropTable('batches', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
