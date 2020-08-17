import _ from 'lodash';
import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const formatters = { stylish, plain, json };

export default (diffTree, outputFormat) => {
  if (!_.has(formatters, outputFormat)) {
    throw new Error(`Unknown output format: '${outputFormat}'.`);
  }

  const format = formatters[outputFormat];
  return format(diffTree);
};
