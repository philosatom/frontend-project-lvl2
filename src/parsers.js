import _ from 'lodash';
import yaml from 'js-yaml';
import ini from 'ini';

const parsers = {
  json: JSON.parse,
  yml: yaml.safeLoad,
  ini: ini.parse,
};

export default (dataFormat) => {
  if (!_.has(parsers, dataFormat)) {
    throw new Error(`There is no parser for '${dataFormat}' format.`);
  }

  return parsers[dataFormat];
};
