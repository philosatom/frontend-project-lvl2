import path from 'path';
import process from 'process';
import genDiff from '../src/gendiff.js';

const getFixturePath = (filename) => path.join(process.cwd(), '__fixtures__', filename);

test('gendiff json', () => {
  const path1 = getFixturePath('before.json');
  const path2 = getFixturePath('after.json');

  const actual = genDiff(path1, path2);
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

  expect(actual).toBe(expected);
});
