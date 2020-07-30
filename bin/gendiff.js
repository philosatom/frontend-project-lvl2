#!/usr/bin/env node

import program from 'commander';
import packageConfig from '../src/package-config.js';
import genDiff from '../src/gendiff.js';

program
  .version(packageConfig.version, '-V, --version', 'output the version number')
  .description(packageConfig.description)
  .helpOption('-h, --help', 'output usage information')
  .option('-f, --format [type]', 'output format')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => console.log(genDiff(filepath1, filepath2)));

program.parse(process.argv);
