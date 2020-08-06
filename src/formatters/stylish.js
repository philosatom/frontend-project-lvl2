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
  removed: ({ key, value }, outerIndent) => `  - ${key}: ${stringify(value, outerIndent)}`,
  added: ({ key, value }, outerIndent) => `  + ${key}: ${stringify(value, outerIndent)}`,
  modified: ({ key, oldValue, newValue }, outerIndent) => [
    `  - ${key}: ${stringify(oldValue, outerIndent)}`,
    `  + ${key}: ${stringify(newValue, outerIndent)}`,
  ],
  unmodified: ({ key, value }, outerIndent) => `    ${key}: ${stringify(value, outerIndent)}`,
};

export default (diffTree) => {
  const iter = (nodes, depth) => {
    const indent = ' '.repeat(4 * depth);
    const delimiter = `\n${indent}`;
    const lines = nodes.flatMap((node) => {
      if (node.type !== 'nested') {
        const buildLine = lineBuilders[node.type];
        const newIndent = `${indent}    `;

        return buildLine(node, newIndent);
      }

      return `    ${node.key}: ${iter(node.children, depth + 1)}`;
    });

    return ['{', ...lines, '}'].join(delimiter);
  };

  return iter(diffTree, 0);
};
