import { CLIENT_VERSION } from './Constants.js';

const socket = io('http://localhost:3000', {
  query: {
    clientVersion: CLIENT_VERSION, // connection 하는 순간에도 클라이언트버전체크를 위함
  },
});

let userId = null;

socket.on('response', (data) => {
  console.log('@@response: =>>>  ', data);

  // 최고점수 처리
  if (data.broadcast && data.handlerId === 50) {
    // TODO: key값 상수로 빼기
    localStorage.setItem('highScore', Math.floor(data.highScore));
  }
});

socket.on('connection', (data) => {
  console.log('@@connection: ', data);
  userId = data.uuid;
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
