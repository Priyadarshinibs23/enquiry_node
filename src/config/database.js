require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;

if (dbUrl) {
  // Use DATABASE_URL for production (Render, Heroku, etc)
  module.exports = {
    development: {
      use_env_variable: 'DATABASE_URL',
      dialect: 'postgres',
      dialectOptions: {
        ssl: true,
        rejectUnauthorized: false,
      },
    },
  };
} else {
  // Use individual env vars for local development
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
