import _ from 'lodash';
import yaml from 'js-yaml';
import ini from 'ini';

const parsers = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.ini': ini.parse
};

export default (extension) => {
  if (!_.has(parsers, extension)) {
    throw new Error(`There is no parser for '${extension}' extension.`);
  }

  return parsers[extension];
};
