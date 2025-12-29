require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

// Start without database for testing
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
