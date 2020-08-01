import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import genDiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename, ext) => path.join(__dirname, '..', '__fixtures__', `${filename}.${ext}`);

const pathToExpected = getFixturePath('expected', 'txt');
const expected = fs.readFileSync(pathToExpected, 'utf-8');

const formats = ['json', 'yml', 'ini'];
const formatsPairs = formats.flatMap((format1) => formats.map((format2) => [format1, format2]));

test.each(formatsPairs)('%s - %s', (ext1, ext2) => {
  const path1 = getFixturePath('before', ext1);
  const path2 = getFixturePath('after', ext2);

  const actual = genDiff(path1, path2);

  expect(actual).toBe(expected);
});