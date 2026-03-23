// middlewares/rateLimiter.js
const redisClient = require('../../utils/redis');
const { MAX_REQUESTS, WINDOW_SIZE } = require('../../utils/constant');
const { insertIntoErrorLogger } = require('./errorLogger');

exports.redisRateLimiter = async(req, res, next) => {
  try {
    if (!redisClient.isOpen) next();
    const key = `rate-limit:${req.ip}`;
    const current = await redisClient.get(key);
    // const keys = await redisClient.keys('*');
    // console.log(keys);

    if (current && Number(current) >= MAX_REQUESTS) {
      const ttl = await redisClient.ttl(key);
      const message = `Too many requests. Please try again in ${ttl} seconds.`;
      await insertIntoErrorLogger(
        message, 
        null,
        req.url,
        req.ip,
        req.method,
        req.headers['user-agent'],
        null,
      );
      return res.status(429).json({ message });
    }

    if (current) {
      await redisClient.incr(key);
    } else {
      await redisClient.set(key, 1, 'EX', WINDOW_SIZE);
      await redisClient.set(key, 1, { EX: WINDOW_SIZE });
    }

    next();
  } catch (err) {
    console.error('Rate limiter error:', err);
    next();
  }
};
