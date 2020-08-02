import _ from 'lodash';
import stylish from './stylish.js';
import plain from './plain.js';

const formatters = {
  stylish: (diffTree) => stylish(diffTree),
  plain: (diffTree) => plain(diffTree)
};

export default (outputFormat) => {
  if (!_.has(formatters, outputFormat)) {
    throw new Error(`There is no '${outputFormat}' formatter.`);
  }

  return formatters[outputFormat];
};
