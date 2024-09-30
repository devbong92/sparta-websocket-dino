import { getHighScore, setHighScore } from '../models/rank.model.js';

/**
 * 최고 점수 업데이트 핸들러
 * @param {*} userId
 * @param {*} payload
 */
export const updateHighScore = async (userId, payload) => {
  console.log('updateHighScore =>>>> ', userId, payload);

  const highScore = await getHighScore();

  if (highScore >= payload.currentScore) {
    return { status: 'fail', message: '최고점수 아님' };
  }

  Promise.all([setHighScore(payload.currentScore, userId)]);

  return {
    broadcast: true,
    handlerId: 50,
    status: 'success',
    highScore: payload.currentScore,
    message: `NEW HIGH SCORE: ${payload.currentScore}:[${userId}]`,
  };
};

/**
 * 최고점수 초기화
 * @returns
 */
export const initHighScore = async () => {
  let highScore = await getHighScore();

  if (!highScore) {
    highScore = { score: 0 };
  }

  return {
    broadcast: true,
    handlerId: 50,
    status: 'success',
    highScore: highScore.score,
    highScoreId: highScore.userId,
  };
};
