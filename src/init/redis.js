import { createClient } from 'redis';

// redis[s]://[[username][:password]@][host][:port][/db-number]:
let redisClient = createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
});

export const initRedisClient = async () => {
  redisClient.on('error', (err) => {
    console.log('Redis Client Error', err);
  });

  await redisClient.connect();

  console.log(' [ initRedisClient ] =>>> ', redisClient);
};

export default redisClient;
