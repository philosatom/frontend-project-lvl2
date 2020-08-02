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
const outputFormats = ['stylish', 'plain'];

const inputFormatsPairs = inputFormats.flatMap((format1) => (
  inputFormats.map((format2) => [format1, format2])
));

const pathsToActual = inputFormats.reduce((acc, format) => {
  const before = getFixturePath('before', format);
  const after = getFixturePath('after', format);

  return { ...acc, [format]: { before, after } };
}, {});

describe.each(outputFormats)('gendiff %s', (outputFormat) => {
  const pathToExpected = getFixturePath(`expected.${outputFormat}`, 'txt');
  const expected = fs.readFileSync(pathToExpected, 'utf-8');

  test.each(inputFormatsPairs)('%s - %s', (inputFormat1, inputFormat2) => {
    const path1 = pathsToActual[inputFormat1].before;
    const path2 = pathsToActual[inputFormat2].after;

    const actual = genDiff(path1, path2, outputFormat);

    expect(actual).toBe(expected);
  });
});

describe('throw errors', () => {
  test('unknown input format', () => {
    const path1 = pathsToActual.json.before;
    const path2 = getFixturePath('expected.plain', 'txt');

    expect(() => genDiff(path1, path2)).toThrow();
  });

  test('unknown output format', () => {
    const path1 = pathsToActual.json.before;
    const path2 = pathsToActual.yml.after;

    expect(() => genDiff(path1, path2, 'unknown')).toThrow();
  });
});
