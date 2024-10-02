import { sendEvent } from './Socket.js';
import itemsData from './assets/item.json' with { type: 'json' };
import stageData from './assets/stage.json' with { type: 'json' };

const stageDataArr = stageData.data.sort((a, b) => a.id - b.id);

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;
  stage = 1;
  stageId = 1000;

  constructor(ctx, scaleRatio, itemController) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  // deltaTime : 브라우저의 프레임 단위 시간 (브라우저마다 다름)
  update(deltaTime, itemController) {
    this.itemController = itemController;
    let currentStage = stageDataArr[this.stage - 1];
    this.score += deltaTime * (0.001 * currentStage.scorePerSecond);

    // 스테이지 변화 가능
    if (this.stageChange && stageData && stageData.data && stageData.data.length > this.stage) {
      let targetStage = stageDataArr[this.stage];
      if (Math.floor(this.score) > targetStage.score && this.stageChange) {
        this.stageChange = false;
        const res = sendEvent(11, {
          currentStage: currentStage.id,
          targetStage: targetStage.id,
          currentScore: Math.floor(this.score),
        });
        this.stage++;
        this.stageId = targetStage.id;
        this.itemController.currentStageId = targetStage.id;
        this.stageChange = true;
      }
    }
  }

  getItem(itemId) {
    let currentItem = itemsData.data.find((e) => e.id === itemId);
    if (!currentItem) {
      console.log('[ERROR] 잘못된 아이템');
    } else {
      this.score += currentItem.score;

      // 아이템 획득
      sendEvent(12, {
        currentStageId: this.stageId,
        itemId: currentItem.id,
        itemScore: currentItem.score,
        currentScore: this.score,
        timestamp: Date.now(),
      });

      console.log('[OK] 아이템 SOCRE ++ ', currentItem.score, this.itemController.currentStageId);
    }
  }

  reset() {
    this.score = 0;
    this.stage = 1;
  }

  setHighScore(playerCoords) {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
      // 최고 점수 업데이트 : 50
      sendEvent(50, {
        currentStageId: this.stageId,
        currentScore: this.score,
        playerCoords: playerCoords,
        timestamp: Date.now(),
      });
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    // score 표기 좌표
    const scoreX = this.canvas.width - 80 * this.scaleRatio;
    const highScoreX = scoreX - 130 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
    this.ctx.fillText(`STAGE : ${this.stage}`, 50, y);
  }
}

export default Score;
