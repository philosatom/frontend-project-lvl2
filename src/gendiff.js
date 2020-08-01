import path from 'path';
import process from 'process';
import fs from 'fs';
import _ from 'lodash';
import parsersByFormat from './parsers.js';

const getFileContent = (filepath) => {
  const fullpath = path.resolve(process.cwd(), filepath);
  return fs.readFileSync(fullpath, 'utf-8');
};

const makeDiff = (data1, data2) => {
  const keys = _.union(Object.keys(data1), Object.keys(data2)).sort();

  return keys.flatMap((key) => {
    if (_.has(data1, key) && !_.has(data2, key)) {
      return { key, status: 'removed', value: data1[key] };
    }

    if (!_.has(data1, key) && _.has(data2, key)) {
      return { key, status: 'new', value: data2[key] };
    }

    const value1 = JSON.stringify(data1[key]);
    const value2 = JSON.stringify(data2[key]);

    if (value1 !== value2) {
      return [
        { key, status: 'removed', value: data1[key] },
        { key, status: 'new', value: data2[key] }
      ];
    }

    return { key, status: 'same', value: data1[key] };
  });
};

const prefixesByStatus = {
  removed: '-',
  new: '+',
  same: ' '
};

const getFormattedDiff = (diff) => {
  const result = diff
    .map(({ key, status, value }) => {
      const prefix = prefixesByStatus[status];
      return `  ${prefix} ${key}: ${value}`;
    })
    .join('\n');

  return `{\n${result}\n}`;
};

export default (path1, path2) => {
  const format1 = path.extname(path1);
  const parse1 = parsersByFormat[format1];
  const content1 = getFileContent(path1);
  const parsed1 = parse1(content1);

  const format2 = path.extname(path2);
  const parse2 = parsersByFormat[format2];
  const content2 = getFileContent(path2);
  const parsed2 = parse2(content2);

  const diff = makeDiff(parsed1, parsed2);

  return getFormattedDiff(diff);
};
