'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if columns exist before adding them
    const table = await queryInterface.describeTable('instructors');
    
    if (!table.image) {
      await queryInterface.addColumn('instructors', 'image', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Instructor profile image URL'
      });
    }

    if (!table.name) {
      await queryInterface.addColumn('instructors', 'name', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Instructor display name'
      });
    }

    if (!table.description) {
      await queryInterface.addColumn('instructors', 'description', {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Instructor bio/description'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('instructors');
    
    if (table.image) {
      await queryInterface.removeColumn('instructors', 'image');
    }
    if (table.name) {
      await queryInterface.removeColumn('instructors', 'name');
    }
    if (table.description) {
      await queryInterface.removeColumn('instructors', 'description');
    }
  }
};
