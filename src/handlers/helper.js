import { getUser, removeUser } from '../models/user.model.js';
import { CLIENT_VERSION } from '../constants.js';
import handlerMappings from './handlerMapping.js';
import { createStage } from '../models/stage.model.js';
import { createItemLog } from '../models/itemLog.model.js';

export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id);
  console.log(`User disconnected: ${socket.id}`);
  console.log('Current users :', getUser());
};

export const handleConnection = (socket, uuid) => {
  console.log(`New user connected!! ${uuid} with Socket ID: ${socket.id}`);
  console.log(`Current users: `, getUser());

  // 버전체크 ?

  // 스테이지 초기화
  createStage(uuid);

  // 아이템 이력 초기화
  createItemLog(uuid);

  // 응답
  socket.emit('connection', { uuid });
};

export const handlerEvent = (io, socket, data) => {
  console.log(' handler Event =>>> ', data);

  // 클라이언트 버전 확인
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit('reponse', { status: 'fail', message: 'Client version mismatch' });
    return;
  }

  const handler = handlerMappings[data.handlerId];
  console.log(' helper.js - handler => ', handler);
  if (!handler) {
    socket.emit('reponse', { status: 'fail', message: 'Handler not found' });
    return;
  }

  const response = handler(data.userId, data.payload);

  // 브로드캐스트라면 io 사용
  if (response.broadcast) {
    io.emit('response', response);
    return;
  }

  console.log('helper.js -  response =>>> ', response);

  socket.emit('response', response);
};
