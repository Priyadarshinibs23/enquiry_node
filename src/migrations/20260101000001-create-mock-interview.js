module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Create MockInterview table
      await queryInterface.createTable(
        'mockInterviews',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          batchId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: 'batches', key: 'id' },
            onDelete: 'CASCADE',
          },
          enquiryId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: 'enquiries', key: 'id' },
            onDelete: 'CASCADE',
          },
          instructorId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onDelete: 'CASCADE',
          },
          studentName: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          studentEmail: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          interviewDate: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          interviewTime: {
            type: Sequelize.TIME,
            allowNull: false,
          },
          mode: {
            type: Sequelize.ENUM('online', 'offline'),
            allowNull: false,
          },
          interviewLink: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          documentUpload: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          status: {
            type: Sequelize.ENUM('scheduled', 'attended', 'not-attended', 'cancelled'),
            defaultValue: 'scheduled',
            allowNull: false,
          },
          feedback: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          score: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          outOf: {
            type: Sequelize.INTEGER,
            defaultValue: 10,
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

      // Create indexes for better query performance
      await queryInterface.addIndex('mockInterviews', ['instructorId'], { transaction });
      await queryInterface.addIndex('mockInterviews', ['enquiryId'], { transaction });
      await queryInterface.addIndex('mockInterviews', ['batchId'], { transaction });
      await queryInterface.addIndex('mockInterviews', ['status'], { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Drop table
      await queryInterface.dropTable('mockInterviews', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
