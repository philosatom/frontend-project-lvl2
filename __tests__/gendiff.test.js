import path from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/gendiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filepath) => path.join(__dirname, '..', '__fixtures__', filepath);
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

test('gendiff json', () => {
  const path1 = getFixturePath('before.json');
  const path2 = getFixturePath('after.json');

  const actual = genDiff(path1, path2);

  expect(actual).toBe(expected);
});

test('gendiff yml', () => {
  const path1 = getFixturePath('before.yml');
  const path2 = getFixturePath('after.yml');

  const actual = genDiff(path1, path2);

  expect(actual).toBe(expected);
});
