import { getGameAssets } from '../init/assets.js';
import { getStage, setStage } from '../models/stage.model.js';
import { getItemLog } from '../models/itemLog.model.js';
import { calculatorScore } from '../utils/score.util.js';

// 유저는 스테이지를 하나씩 올라갈 수 있다. ( 1 -> 2, 2 -> 3 )
// 유저는 일정 점수가 되면 다음 스테이지로 이동한다.
export const moveStageHandler = (userId, payload) => {
  console.log('moveStageHandler =>>>> ', userId, payload);

  // 유저의 현재 스테이지 정보
  let currentStages = getStage(userId);
  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 오름 차순 -> 가장 큰 스테이지 ID를 확인
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  // 클라이언트 vs 서버 비교
  if (currentStage.id !== payload.currentStage) {
    return { status: 'fail', message: 'Current Stage mismatch' };
  }

  const { stages } = getGameAssets();

  // 현재 스테이지 데이터
  const currentStageData = stages.data.find((e) => e.id === currentStage.id);

  // 아이템 이력
  const currentItemLogs = getItemLog(userId);

  let currentItemScore = 0;
  currentItemLogs.forEach((e) => {
    currentItemScore += e.itemScore;
  });

  // 점수 검증
  const serverTime = Date.now(); //  현재 타임스탬프
  const elapsedTime = (serverTime - currentStage.timestamp) / 1000;
  const serverCalcScore = elapsedTime * currentStageData.scorePerSecond + currentItemScore; // 서버 계산 스코어

  // 타겟 스테이지 메타정보 조회
  const targetStageDataArr = stages.data.filter((e) => e.id === payload.targetStage);

  if (!targetStageDataArr || targetStageDataArr.length < 1) {
    return { status: 'fail', message: '다음 스테이지 정보가 없습니다.' };
  }

  //
  let targetStageLimitScore = targetStageDataArr[0].score;
  let latencyTime = 5 * currentStageData.scorePerSecond;

  // 점수계산 검증 필요 - 과제 ?
  let calcScore = calculatorScore(currentStage.id, currentStage.timestamp, currentStage);

  /**
   * 유저 스테이지 이력 기반으로 점수 누적 해서 계산
   */
  let currentStageItemScore = 0;
  getItemLog(userId).forEach((e) => {
    if (e.stageId === currentStage.id) {
      currentStageItemScore += e.itemScore;
    }
  });

  // 아이템으로 넘는 경우는 레이턴시가 아닌데..
  if (Math.abs(payload.currentScore - currentStageItemScore - calcScore) > latencyTime) {
    return { status: 'fail', message: 'Invalid elapsed time' };
  }

  // targetStage에 대한 검증, 게임에셋에 존재하는가 ?
  if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
    return { status: 'fail', message: 'Target Stage not found' };
  }

  setStage(userId, payload.targetStage, serverTime, payload.currentScore);

  return {
    status: 'success',
    message: `move Stage : ${payload.currentStage} -> ${payload.targetStage}`,
  };
};
