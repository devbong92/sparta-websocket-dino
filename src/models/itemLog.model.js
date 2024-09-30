import redisClient from '../init/redis.js';

const KEY_PREFIX = 'itemLogs:';
const TTL = 60 * 60 * 24 * 7; // 7일

/**
 * 유저별 : 아이템 이력 관리
 */
// const itemLog = {};

export const createItemLog = (uuid) => {
  clearItemLog(uuid);
};

export const getItemLog = async (uuid) => {
  // return itemLog[uuid];
  let res = await redisClient.lRange(KEY_PREFIX + uuid, 0, -1);
  res = res.map((e) => JSON.parse(e));
  return res;
};

export const setItemLog = async (uuid, stageId, itemId, itemScore, timestamp) => {
  await redisClient.rPush(
    KEY_PREFIX + uuid,
    JSON.stringify({ stageId, itemId, itemScore, timestamp }),
    { EX: TTL },
  );
};

export const clearItemLog = (uuid) => {
  redisClient.del(KEY_PREFIX + uuid);
};
