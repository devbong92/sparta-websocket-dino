import { getStage, setStage, clearStage } from '../models/stage.model.js';
import { getGameAssets } from '../init/assets.js';
import { getItemLog } from '../models/itemLog.model.js';

// 게임 시작
export const gameStart = async (uuid, payload) => {
  const { stages } = getGameAssets();

  // 기존 스테이지 정보 초기화
  clearStage(uuid);

  // 첫번째 스테이지
  // * 본래 클라이언트에서 오는 데이터를 그대로 수용하는 경우는 없음, 하지만 개발편의를 위해서 이번은 이렇게 진행
  await setStage(uuid, stages.data[0].id, payload.timestamp, 0);

  return { status: 'success' };
};

// 게임 종료
export const gameEnd = async (uuid, payload) => {
  // 클라이언트는 게임 종료 시, 타임스탬프와 총 점수

  console.log('@@@@ GAME END ===>>> ', uuid, payload);

  // timestamp: gameEndTime timestamp를 gameEndTime으로 사용하겠다는 문법
  const { timestamp: gameEndTime, score } = payload;

  const stages = await getStage(uuid);
  if (!stages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  const itemLogs = await getItemLog(uuid);

  const { stages: stagesData } = getGameAssets();

  // 각 스테이즈의 지속 시간을 계산하여 총 점수 계산
  let totalScore = 0;
  stages.forEach((stage, index) => {
    let stageEndTime;
    if (index === stages.length - 1) {
      stageEndTime = gameEndTime;
    } else {
      stageEndTime = stages[index + 1].timestamp;
    }

    // 현재 스테이지 데이터
    const currentStageData = stagesData.data.find((e) => e.id === stage.id);

    // 아이템 이력 점수
    let itemScore = 0;
    const currentStageItems = itemLogs.filter((e) => e.stageId === stage.id);
    currentStageItems.forEach((e) => {
      itemScore += e.itemScore;
    });

    const stageDuration = (stageEndTime - stage.timestamp) / 1000;
    totalScore += stageDuration * currentStageData.scorePerSecond; // 1초당 1점 - 추가는 개인과제
    totalScore += itemScore;
    console.log(stage.id, '] totalScore =>> ', totalScore, itemScore);
  });

  // 점수와 타임스탬프 검증
  // 오차범위 5
  if (Math.abs(score - totalScore > 5)) {
    return { status: 'fail', message: 'Score verification failed' };
  }

  // DB에 저장한다고 가정한다면 이곳에서
  // setResult(userId, socre, timestamp)

  // 클라이언트의 점수를 인정해줌
  return { status: 'success', message: 'Game ended', score };
};
