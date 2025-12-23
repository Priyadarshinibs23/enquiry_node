'use strict';

/** @type {import('sequelize-cli').Seeder} */
const bcrypt = require('bcrypt');

module.exports = {
  async up (queryInterface, Sequelize) {
    const hash = await bcrypt.hash('Admin@123', 10);
    await queryInterface.bulkInsert('users', [
      {
        email: 'admin@example.com',
        password: hash,
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { email: 'admin@example.com' }, {});
  }
};
