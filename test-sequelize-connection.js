#!/usr/bin/env node

// Test Sequelize connection with current config
const { Sequelize } = require('sequelize');
const config = require('./src/config/database').development;
require('dotenv').config();

async function testSequelizeConnection() {
  try {
    console.log('Testing Sequelize connection with config:');
    console.log('URL:', config.url ? config.url.substring(0, 50) + '...' : 'not using URL');
    console.log('Dialect:', config.dialect);
    console.log('SSL:', JSON.stringify(config.dialectOptions?.ssl));
    
    const sequelize = new Sequelize(config);
    
    console.log('\nAttempting connection...');
    await sequelize.authenticate();
    console.log('✓ Sequelize connection successful!');
    
    const result = await sequelize.query('SELECT NOW()');
    console.log('✓ Query test successful:', result[0][0]);
    
    await sequelize.close();
  } catch (error) {
    console.error('✗ Connection failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testSequelizeConnection();
