import { addUser } from '../models/user.model.js';
import { v4 as uuidv4 } from 'uuid';
import { handleDisconnect, handleConnection, handlerEvent } from './helper.js';
import { initHighScore } from './rank.handler.js';

const registerHandler = (io) => {
  io.on('connection', (socket) => {
    //이벤트 처리

    // 유저정보 생성
    const userUUID = uuidv4();
    addUser({ uuid: userUUID, socketId: socket.id });

    // 연결 초기화
    handleConnection(socket, userUUID);

    // 최고점수
    socket.emit('response', initHighScore());

    // event handler 호출
    socket.on('event', (data) => handlerEvent(io, socket, data));

    // 접속해제시 이벤트
    socket.on('disconnect', () => handleDisconnect(socket, userUUID));
  });
};

export default registerHandler;
