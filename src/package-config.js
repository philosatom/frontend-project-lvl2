import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fullpath = path.join(__dirname, '..', 'package.json');

const getPackageConfig = (filepath) => {
  const content = fs.readFileSync(filepath, 'utf-8');
  return JSON.parse(content);
};

export default getPackageConfig(fullpath);
