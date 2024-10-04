import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// redis[s]://[[username][:password]@][host][:port][/db-number]:
const redisClient = createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_USERPASS}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
  socket: {
    port: process.env.REDIS_HOST,
    host: process.env.REDIS_PORT,
  },
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
