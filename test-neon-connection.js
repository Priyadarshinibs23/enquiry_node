#!/usr/bin/env node

// Test Neon connection without Sequelize
const { Client } = require('pg');
require('dotenv').config();

async function testConnection() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('Testing Neon connection...');
    await client.connect();
    console.log('✓ Successfully connected to Neon!');
    
    const result = await client.query('SELECT NOW()');
    console.log('✓ Database query successful:', result.rows[0]);
    
    await client.end();
  } catch (error) {
    console.error('✗ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
