require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

// Debug: Log environment variables (remove passwords in production logs)
console.log('Environment Check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set (length: ' + process.env.DATABASE_URL.length + ')' : '❌ Not Set');
console.log('PORT:', PORT);

(async () => {
  try {
    console.log('Attempting to connect to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Sync database (optional, be careful in production)
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
    }

    // Listen on 0.0.0.0 for Render compatibility
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, closing server gracefully...');
      server.close(() => {
        sequelize.close();
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  }
})();