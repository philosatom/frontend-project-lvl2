import _ from 'lodash';
import yaml from 'js-yaml';
import ini from 'ini';

const parsers = {
  json: JSON.parse,
  yml: yaml.safeLoad,
  ini: ini.parse,
};

export default (data, dataFormat) => {
  if (!_.has(parsers, dataFormat)) {
    throw new Error(`Unknown data format: '${dataFormat}'.`);
  }

  const parse = parsers[dataFormat];
  return parse(data);
};
