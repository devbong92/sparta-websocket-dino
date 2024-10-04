import express from 'express';
import { createServer } from 'http'; // Node.js에서 기본제공
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/assets.js';
import dotenv from 'dotenv';
import { initRedisClient } from './init/redis.js';
import cors from 'cors';

const app = express();
const server = createServer(app);

const PORT = 3001;

// CORS
const whitelist = ['http://localhost:3001'];
const corsOptions = {
  origin: function (origin, callback) {
    console.log(' origin ==.>> ', origin);

    if (!origin || whitelist.indexOf(origin) !== -1) {
      // 만일 whitelist 배열에 origin인자가 있을 경우
      callback(null, true); // cors 허용
    } else {
      callback(new Error('Not Allowed Origin!')); // cors 비허용
    }
  },
};
app.use(cors(corsOptions)); // 옵션을 추가한 CORS 미들웨어 추가

dotenv.config();

app.use(express.json()); // json 파싱
app.use(express.urlencoded({ extended: false })); // URL 인코딩, library 사용유무
app.use(express.static('public')); // 정적파일 서빙

// init 폴더
initSocket(server);

app.get('/', (req, res, next) => {
  res.send('hello world!');
});

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    // 이 곳에서 파일을 읽음
    const assets = await loadGameAssets();
    console.log('Assets =>> ', assets);
    console.log('Assets loaded successfully');

    // redis
    await initRedisClient();
  } catch (e) {
    console.error('Failed to load game assets: ', e);
  }
});
