import path from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/gendiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename, ext) => path.join(__dirname, '..', '__fixtures__', `${filename}.${ext}`);
const expected = [
  '{',
  '  - follow: false',
  '    host: hexlet.io',
  '  - proxy: 123.234.53.22',
  '  - timeout: 50',
  '  + timeout: 20',
  '  + verbose: true',
  '}'
].join('\n');

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
