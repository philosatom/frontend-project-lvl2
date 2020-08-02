import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import _ from 'lodash';

const getPackageConfig = (filepath) => {
  const content = fs.readFileSync(filepath, 'utf-8');
  return JSON.parse(content);
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fullpath = path.join(__dirname, '..', 'package.json');
const packageConfig = getPackageConfig(fullpath);

export default (propertyName) => {
  if (!_.has(packageConfig, propertyName)) {
    throw new Error(`There is no '${propertyName}' property in package config.`);
  }

  return packageConfig[propertyName];
};
