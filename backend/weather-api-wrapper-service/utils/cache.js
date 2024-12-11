import redis from "redis";

const redisClient = redis.createClient({ url: process.env.REDIS_URL });
const CACHE_EXPIRATION = process.env.CACHE_EXPIRATION || 43200;

redisClient
  .connect()
  .catch((error) => console.error("Redis connection error", error));

const getCache = async (key) => {
  try {
    return await redisClient.get(key);
  } catch (error) {
    console.error("Error accessing cache", error);
    return null;
  }
};

const setCache = async (key, value) => {
  try {
    await redisClient.set(key, JSON.stringify(value), { EX: CACHE_EXPIRATION });
  } catch (error) {
    console.error("Error setting cache", error);
  }
};

export { redisClient, getCache, setCache };
