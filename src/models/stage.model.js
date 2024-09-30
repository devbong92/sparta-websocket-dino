import redisClient from '../init/redis.js';

const KEY_PREFIX = 'stages:';
const TTL = 60 * 60 * 24 * 7; // 7일

// key: uuid, value: array -> stage 정보는 배열
// const stages = {};

// 스테이지 초기화
export const createStage = (uuid) => {
  clearStage(uuid);
};

export const getStage = async (uuid) => {
  let res = await redisClient.lRange(KEY_PREFIX + uuid, 0, -1);
  res = res.map((e) => JSON.parse(e));
  return res;
};

export const setStage = async (uuid, id, timestamp, score) => {
  await redisClient.rPush(KEY_PREFIX + uuid, JSON.stringify({ id, timestamp, score }), { EX: TTL });
};

export const clearStage = (uuid) => {
  redisClient.del(KEY_PREFIX + uuid);
};
