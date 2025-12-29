require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;

console.log('Config - DATABASE_URL present:', !!dbUrl);

if (dbUrl) {
  // Production/Neon configuration
  const config = {
    production: {
      dialect: 'postgres',
      url: dbUrl,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      logging: false,
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
      logging: console.log,
    },
  };
  
  console.log('Using DATABASE_URL configuration');
  module.exports = config;
} else {
  // Local development fallback
  console.log('Using local PostgreSQL configuration');
  module.exports = {
    development: {
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: console.log,
    },
  };
}