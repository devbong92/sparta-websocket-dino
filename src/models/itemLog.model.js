import redisClient from '../init/redis.js';

const KEY_PREFIX = 'itemLogs:';
const TTL = 60 * 60 * 24 * 7; // 7일

/**
 * 유저별 아이템 이력 데이터 생성
 * @param {*} uuid
 */
export const createItemLog = (uuid) => {
  clearItemLog(uuid);
};

/**
 * 아이템 이력 데이터 조회
 * @param {*} uuid
 * @returns
 */
export const getItemLog = async (uuid) => {
  // return itemLog[uuid];
  let res = await redisClient.lRange(KEY_PREFIX + uuid, 0, -1);
  res = res.map((e) => JSON.parse(e));
  return res;
};

/**
 * 아이템 이력 저장
 * @param {*} uuid
 * @param {*} stageId
 * @param {*} itemId
 * @param {*} itemScore
 * @param {*} timestamp
 */
export const setItemLog = async (uuid, stageId, itemId, itemScore, timestamp) => {
  await redisClient.rPush(
    KEY_PREFIX + uuid,
    JSON.stringify({ stageId, itemId, itemScore, timestamp }),
    { EX: TTL },
  );
};

/**
 * 아이템 이력 초기화
 * @param {*} uuid
 */
export const clearItemLog = (uuid) => {
  redisClient.del(KEY_PREFIX + uuid);
};
