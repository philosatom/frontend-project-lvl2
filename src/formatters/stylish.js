import _ from 'lodash';

const indentSize = 4;
const getDelimiter = (depth) => {
  const indent = ' '.repeat(indentSize * depth);
  return `\n${indent}`;
};

const stringify = (data, depth) => {
  if (!_.isPlainObject(data)) return data;

  const delimiter = getDelimiter(depth);
  const keys = _.keys(data).sort();
  const lines = keys.map((key) => {
    const value = data[key];
    const newValue = stringify(value, depth + 1);

    return `    ${key}: ${newValue}`;
  });

  return ['{', ...lines, '}'].join(delimiter);
};

const lineBuilders = {
  removed: ({ key, value }, { depth }) => `  - ${key}: ${stringify(value, depth)}`,
  added: ({ key, value }, { depth }) => `  + ${key}: ${stringify(value, depth)}`,
  modified: ({ key, oldValue, newValue }, { depth }) => [
    `  - ${key}: ${stringify(oldValue, depth)}`,
    `  + ${key}: ${stringify(newValue, depth)}`,
  ],
  unmodified: ({ key, value }, { depth }) => `    ${key}: ${stringify(value, depth)}`,
  nested: ({ key, children }, { iteratee, depth }) => `    ${key}: ${iteratee(children, depth)}`,
};

const getLine = (node, options) => {
  const buildLine = lineBuilders[node.type];
  return buildLine(node, options);
};

export default (diffTree) => {
  const iter = (nodes, depth) => {
    const delimiter = getDelimiter(depth);
    const lines = nodes.flatMap((node) => getLine(node, { depth: depth + 1, iteratee: iter }));

    return ['{', ...lines, '}'].join(delimiter);
  };

  return iter(diffTree, 0);
};
