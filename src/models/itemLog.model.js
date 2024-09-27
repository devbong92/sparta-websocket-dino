/**
 * 유저별 : 아이템 이력 관리
 */
const itemLog = {};

export const createItemLog = (uuid) => {
  itemLog[uuid] = [];
};

export const getItemLog = (uuid) => {
  return itemLog[uuid];
};

export const setItemLog = (uuid, stageId, itemId, itemScore, timestamp) => {
  return itemLog[uuid].push({ stageId, itemId, itemScore, timestamp });
};

export const clearItemLog = (uuid) => {
  itemLog[uuid] = [];
};
