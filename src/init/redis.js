import { createClient } from 'redis';

let redisClient = createClient();

export const initRedisClient = async () => {
  redisClient.on('error', (err) => {
    console.log('Redis Client Error', err);
  });

  await redisClient.connect();

  console.log(' [ initRedisClient ] =>>> ', redisClient);
};

export default redisClient;
