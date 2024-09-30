import redisClient from '../init/redis.js';

const KEY_PREFIX = 'users:';
const TTL = 60 * 60 * 24 * 7; // 7일

export const addUser = async (user) => {
  // EX : '초'로 설정
  // PX : 밀리초
  await redisClient.set(KEY_PREFIX + user.uuid, JSON.stringify(user), { EX: TTL });
};

// 유저가 접속해제했을 때 사용
export const removeUser = (socketId, userId) => {
  redisClient.del(KEY_PREFIX + userId);
};

export const getUser = async () => {
  const arr = await redisClient.keys(KEY_PREFIX + '*');
  const users = [];
  if (arr) {
    for (let tmp of arr) {
      const res = await redisClient.get(tmp);
      users.push(JSON.parse(res));
    }
  }
  return users;
};
