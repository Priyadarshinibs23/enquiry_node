require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;

if (dbUrl) {
  // Production/Neon configuration
  module.exports = {
    production: {
      dialect: 'postgres',
      url: dbUrl,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    },
    development: {
      dialect: 'postgres',
      url: dbUrl,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    },
  };
} else {
  // Local development fallback
  module.exports = {
    development: {
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
    },
  };
}