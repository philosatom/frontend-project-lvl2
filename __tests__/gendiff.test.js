import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import genDiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename, ext) => path.join(__dirname, '..', '__fixtures__', `${filename}.${ext}`);

const pathToExpected = getFixturePath('expected', 'txt');
const expected = fs.readFileSync(pathToExpected, 'utf-8');

test.each([
  ['json'],
  ['yml'],
  ['ini']
])('gendiff %s', (ext) => {
  const path1 = getFixturePath('before', ext);
  const path2 = getFixturePath('after', ext);

  const actual = genDiff(path1, path2);

  expect(actual).toBe(expected);
});
