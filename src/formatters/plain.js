import _ from 'lodash';

const stringify = (value) => {
  if (_.isPlainObject(value)) return '[complex value]';
  if (_.isString(value)) return `'${value}'`;

  return value;
};

const lineBuilders = {
  removed: (path) => `Property '${path}' was removed`,
  new: (path, { value }) => (
    `Property '${path}' was added with value: ${stringify(value)}`
  ),
  modified: (path, { oldValue, newValue }) => (
    `Property '${path}' was updated from ${stringify(oldValue)} to ${stringify(newValue)}`
  )
};

export default (diffTree) => {
  const iter = (nodes, ancestors) => nodes
    .filter(({ status }) => status !== 'unmodified')
    .map((node) => {
      const newAncestors = [...ancestors, node.key];
      const pathToCurrent = newAncestors.join('.');

      if (!_.has(node, 'children')) {
        const buildLine = lineBuilders[node.status];
        return buildLine(pathToCurrent, node);
      }

      return iter(node.children, newAncestors);
    })
    .join('\n');

  return iter(diffTree, []);
};
