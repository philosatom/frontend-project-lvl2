import path from 'path';
import process from 'process';
import fs from 'fs';
import parsers from './parsers.js';
import buildDiffTree from './buildDiffTree.js';
import getFormattedDiff from './stylish.js';

const getFileContent = (filepath) => {
  const fullpath = path.resolve(process.cwd(), filepath);
  return fs.readFileSync(fullpath, 'utf-8');
};

export default (path1, path2) => {
  const extension1 = path.extname(path1);
  const parse1 = parsers[extension1];
  const content1 = getFileContent(path1);
  const parsed1 = parse1(content1);

  const extension2 = path.extname(path2);
  const parse2 = parsers[extension2];
  const content2 = getFileContent(path2);
  const parsed2 = parse2(content2);

  const diffTree = buildDiffTree(parsed1, parsed2);

  return getFormattedDiff(diffTree);
};
