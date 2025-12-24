require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;

module.exports = {
  development: dbUrl
    ? {
        url: dbUrl,
        dialect: 'postgres',
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }
    : {
        username: process.env.DB_USER,
        password: String(process.env.DB_PASSWORD || ''),
        database: process.env.DB_NAME,
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
      },

  production: {
    url: dbUrl,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
