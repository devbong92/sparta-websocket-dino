import { getHighScore, setHighScore } from '../models/rank.model.js';
import handlerMappings from './handlerMapping.js';

/**
 * 최고 점수 업데이트 핸들러
 * @param {*} userId
 * @param {*} payload
 */
export const updateHighScore = (userId, payload) => {
  console.log('updateHighScore =>>>> ', userId, payload);

  const highScore = getHighScore();

  if (highScore >= payload.currentScore) {
    return { status: 'fail', message: '최고점수 아님' };
  }

  setHighScore(payload.currentScore);

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
export const initHighScore = () => {
  let highScore = getHighScore();
  if (!highScore) {
    highScore = 0;
  }

  return {
    broadcast: true,
    handlerId: 50,
    status: 'success',
    highScore: highScore,
  };
};
