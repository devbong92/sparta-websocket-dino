import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let gameAssets = {};

//import.meta.url : 현재 파일의 절대경로
const __filename = fileURLToPath(import.meta.url);
// 파일의 위치
const __dirname = path.dirname(__filename);
// 위에서 구한 값을 기반으로 상대경로 생성
// 최상위 경로 + assets 폴더
const basePath = path.join(__dirname, '../../public/assets');

// 파일 하나를 읽는 함수
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    // options는 더 찾아볼 것
    fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

// 비동기 병렬로 파일을 읽는다.
// Promise.all()
export const loadGameAssets = async () => {
  try {
    const [stages, items, itemUnlocks] = await Promise.all([
      readFileAsync('stage.json'),
      readFileAsync('item.json'),
      readFileAsync('item_unlock.json'),
    ]);

    gameAssets = { stages, items, itemUnlocks };
    return gameAssets;
  } catch (e) {
    throw new Error('Failed to load game assets: ' + e.message);
  }
};

export const getGameAssets = () => {
  return gameAssets;
};
