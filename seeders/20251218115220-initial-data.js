'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    /* -------------------- USERS -------------------- */
    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    await queryInterface.bulkInsert(
      'users',
      [
        {
          email: 'admin@example.com',
          password: hashedPassword,
          role: 'ADMIN',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { ignoreDuplicates: true }
    );

    /* -------------------- SUBJECTS -------------------- */
    await queryInterface.bulkInsert(
      'subjects',
      [
        {
          id: 1,
          name: 'Software Testing',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Java Development',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { ignoreDuplicates: true }
    );

    /* -------------------- PACKAGES -------------------- */
    await queryInterface.bulkInsert(
      'packages',
      [
        {
          name: 'Manual Testing',
          code: 'MT-101',
          subjectId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Automation Testing',
          code: 'AT-201',
          subjectId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Core Java',
          code: 'JAVA-101',
          subjectId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { ignoreDuplicates: true }
    );
  },

  async down(queryInterface) {
    /* DELETE IN REVERSE ORDER */
    await queryInterface.bulkDelete('packages', null, {});
    await queryInterface.bulkDelete('subjects', null, {});
    await queryInterface.bulkDelete('users', {
      email: 'admin@example.com',
    });
  },
};
