require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;

const getConfig = () => {
  if (dbUrl) {
    // For Neon DB - parse URL and use individual connection parameters
    // This avoids Sequelize's URL handling which doesn't properly merge dialectOptions
    try {
      const url = new URL(dbUrl);
      return {
        dialect: 'postgres',
        username: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        host: url.hostname,
        port: parseInt(url.port || 5432),
        database: url.pathname.substring(1), // remove leading /
        dialectOptions: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
        pool: {
          max: 2,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
      };
    } catch (err) {
      console.error('Failed to parse DATABASE_URL:', err.message);
      // Fallback to local PostgreSQL
      return {
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'enquiry_form',
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false,
      };
    }
  } else {
    // Local development fallback (local PostgreSQL)
    return {
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'enquiry_form',
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
    };
  }
};

const config = getConfig();

module.exports = {
  production: config,
  development: config,
};