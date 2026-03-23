/* eslint-disable no-console */
const { createClient } = require('redis');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const config = require('../config/redisconfig.json')[env];

const redisClient = createClient({
  socket: {
    host: config.host || '127.0.0.1',
    port: config.port || 6379,
  },
  // password: config.password // Uncomment if needed
});

redisClient.on('connect', () => console.log('Redis: connecting...'));
redisClient.on('ready', () => console.log('Redis: connected and ready!  ✅'));
redisClient.on('error', (err) => console.error('Redis: error', err));
redisClient.on('end', () => console.log('Redis: connection closed.'));
redisClient.on('reconnecting', () => console.log('♻️  Redis: reconnecting...'));

// Connect Redis client on load
// (async() => {
//   try {
//     await redisClient.connect();
//   } catch (err) {
//     console.error('Redis: failed to connect', err);
//   }
// })();

module.exports = redisClient;
