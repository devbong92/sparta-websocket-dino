import express from 'express';
import { createServer } from 'http'; // Node.js에서 기본제공
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/assets.js';
import dotenv from 'dotenv';
import { initRedisClient } from './init/redis.js';

const app = express();
const server = createServer(app);

const PORT = 3001;

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

    // redis 설정
    await initRedisClient();
  } catch (e) {
    console.error('Failed to load game assets: ', e);
  }
});
