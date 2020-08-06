import path from 'path';
import process from 'process';
import fs from 'fs';
import _ from 'lodash';
import getParser from './parsers.js';
import buildDiffTree from './buildDiffTree.js';
import getFormatter from './formatters/index.js';

const getFileContent = (filepath) => {
  const fullpath = path.resolve(process.cwd(), filepath);
  return fs.readFileSync(fullpath, 'utf-8');
};

const getDataFormat = (filepath) => {
  const extension = path.extname(filepath);
  return _.trimStart(extension, '.');
};

const getParsed = (data, format) => {
  const parse = getParser(format);
  return parse(data);
};

export default (filepath1, filepath2, outputFormat) => {
  const content1 = getFileContent(filepath1);
  const dataFormat1 = getDataFormat(filepath1);
  const parsed1 = getParsed(content1, dataFormat1);

  const content2 = getFileContent(filepath2);
  const dataFormat2 = getDataFormat(filepath2);
  const parsed2 = getParsed(content2, dataFormat2);

  const diffTree = buildDiffTree(parsed1, parsed2);
  const getFormattedDiff = getFormatter(outputFormat);

  return getFormattedDiff(diffTree);
};
