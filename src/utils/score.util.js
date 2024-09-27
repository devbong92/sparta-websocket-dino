import { getGameAssets } from '../init/assets.js';

/**
 * SCORE 관련 유틸 모음
 */

/**
 * 스코어를 계산
 * @param {*} currentStageId
 * @param {*} lastTimestamp
 * @param {*} userLastStage
 * @param {*} userItemLogs
 * @returns
 */
export const calculatorScore = (currentStageId, lastTimestamp, userLastStage, userItemLogs) => {
  let totalScore = 0;

  const { stages } = getGameAssets();

  // 현재 스테이지 데이터
  const currentStageData = stages.data.find((e) => e.id === currentStageId);

  // 타이머 점수
  const serverTime = Date.now();
  const elapsedTime = (serverTime - lastTimestamp) / 1000;
  const serverCalcScore = elapsedTime * currentStageData.scorePerSecond;

  totalScore = userLastStage.score + serverCalcScore; // currentStageItemScore +

  return totalScore;
};
