import _ from 'lodash';

const stringify = (data, indent) => {
  if (!_.isPlainObject(data)) return data;

  const delimiter = `\n${indent}`;
  const keys = Object.keys(data).sort();
  const lines = keys.map((key) => {
    const value = data[key];
    const newIndent = `${indent}    `;
    const newValue = stringify(value, newIndent);

    return `    ${key}: ${newValue}`;
  });

  return ['{', ...lines, '}'].join(delimiter);
};

const lineBuilders = {
  removed: ({ key, value }, { indent }) => `  - ${key}: ${stringify(value, indent)}`,
  added: ({ key, value }, { indent }) => `  + ${key}: ${stringify(value, indent)}`,
  modified: ({ key, oldValue, newValue }, { indent }) => [
    `  - ${key}: ${stringify(oldValue, indent)}`,
    `  + ${key}: ${stringify(newValue, indent)}`,
  ],
  unmodified: ({ key, value }, { indent }) => `    ${key}: ${stringify(value, indent)}`,
  nested: ({ key, children }, { iteratee, depth }) => `    ${key}: ${iteratee(children, depth)}`,
};

export default (diffTree) => {
  const iter = (nodes, depth) => {
    const indent = ' '.repeat(4 * depth);
    const delimiter = `\n${indent}`;
    const lines = nodes.flatMap((node) => {
      const buildLine = lineBuilders[node.type];
      const options = {
        indent: `${indent}    `,
        depth: depth + 1,
        iteratee: iter,
      };

      return buildLine(node, options);
    });

    return ['{', ...lines, '}'].join(delimiter);
  };

  return iter(diffTree, 0);
};
