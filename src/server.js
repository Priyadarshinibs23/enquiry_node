require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // Test database connection with retry logic
    let retries = 3;
    let connected = false;

    while (retries > 0 && !connected) {
      try {
        await sequelize.authenticate();
        console.log('✓ Database connected successfully');
        connected = true;
      } catch (error) {
        retries--;
        if (retries > 0) {
          console.log(`Database connection failed, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
        } else {
          throw error;
        }
      }
    }

    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
})();