#!/usr/bin/env node

import program from 'commander';
import getConfigPropertyValue from '../src/package-config.js';
import genDiff from '../src/gendiff.js';

program
  .version(getConfigPropertyValue('version'), '-V, --version', 'output the version number')
  .description(getConfigPropertyValue('description'))
  .helpOption('-h, --help', 'output usage information')
  .option('-f, --format [type]', 'output format', 'stylish')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => console.log(genDiff(filepath1, filepath2, program.format)));

program.parse(process.argv);
