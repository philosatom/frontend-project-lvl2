import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import genDiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename, format) => (
  path.join(__dirname, '..', '__fixtures__', `${filename}.${format}`)
);

const inputFormats = ['json', 'yml', 'ini'];
const outputFormats = ['stylish', 'plain', 'json'];

const inputFormatsPairs = inputFormats.flatMap((format1) => (
  inputFormats.map((format2) => [format1, format2])
));

describe.each(outputFormats)('gendiff %s', (outputFormat) => {
  const pathToExpected = getFixturePath(`expected-${outputFormat}`, 'txt');
  const expected = fs.readFileSync(pathToExpected, 'utf-8');

  test.each(inputFormatsPairs)('%s - %s', (inputFormat1, inputFormat2) => {
    const path1 = getFixturePath('before', inputFormat1);
    const path2 = getFixturePath('after', inputFormat2);

    const actual = genDiff(path1, path2, outputFormat);

    expect(actual).toBe(expected);
  });
});

describe('throw errors', () => {
  test('unknown input format', () => {
    const path1 = getFixturePath('before', 'json');
    const path2 = getFixturePath('expected-stylish', 'txt');

    expect(() => genDiff(path1, path2)).toThrow();
  });

  test('unknown output format', () => {
    const path1 = getFixturePath('before', 'json');
    const path2 = getFixturePath('after', 'yml');

    expect(() => genDiff(path1, path2, 'unknown')).toThrow();
  });
});
