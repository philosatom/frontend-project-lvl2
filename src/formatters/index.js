import _ from 'lodash';
import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const formatters = { stylish, plain, json };

export default (outputFormat) => {
  if (!_.has(formatters, outputFormat)) {
    throw new Error(`There is no '${outputFormat}' formatter.`);
  }

  return formatters[outputFormat];
};
