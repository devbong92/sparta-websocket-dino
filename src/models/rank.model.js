const rank = {};

/**
 * 랭킹 초기화
 */
export const initRank = () => {
  rank['highScore'] = 0;
  rank['list'] = [];
};

/**
 * 최고점수 조회
 * @returns highScore
 */
export const getHighScore = () => {
  return rank['highScore'];
};

/**
 * 최고점수 저장
 * @param {number} score
 */
export const setHighScore = (score) => {
  rank['highScore'] = score;
};

/**
 * 랭킹 리스트 조회
 * @returns
 */
export const getRankList = () => {
  return rank['list'];
};

/**
 * 랭킹 리스트 저장
 */
export const setRankList = (userId, score, timestamp) => {
  rank['list'].push({ userId, score, timestamp });
};
