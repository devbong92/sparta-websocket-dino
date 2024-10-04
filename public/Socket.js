import { CLIENT_VERSION } from './Constants.js';
import { setGhostMoves } from './index.js';

let userId = localStorage.getItem('userId');

const socket = io('http://localhost:3001', {
  query: {
    clientVersion: CLIENT_VERSION, // connection 하는 순간에도 클라이언트버전체크를 위함
    userId,
  },
});

socket.on('response', (data) => {
  console.log('@@response: =>>>  ', data);

  // 최고점수 처리
  if (data.broadcast && data.handlerId === 50) {
    // TODO: key값 상수로 빼기
    localStorage.setItem('highScore', Math.floor(data.highScore));

    console.log('data.highScorerCoords =>>> ', data.highScorerCoords);
    if (data.highScorerCoords) {
      setGhostMoves(data.highScorerCoords);
    }

    if (userId === data.highScoreId) {
      alert('랭킹 1위의 복귀를 환영합니다.');
    }
  }
});

socket.on('connection', (data) => {
  console.log('@@connection: ', data);
  userId = data.uuid;
  localStorage.setItem('userId', userId);
});

const sendEvent = (handlerId, payload) => {
  const res = socket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });

  console.log('res =>> ', res);
};

export { sendEvent };
