import { createClient } from '@redis/client';

// Create a Redis client instance
const redisClient = createClient({
    url: `redis://${process.env.REDIS_PASSWORD ? `${process.env.REDIS_PASSWORD}@` : ''}${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

// Handle connection errors
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

// Connect to Redis
(async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Redis connection error:', err);
    }
})();

export default redisClient;
