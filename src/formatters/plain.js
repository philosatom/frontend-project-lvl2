import _ from 'lodash';

const stringify = (value) => {
  if (_.isPlainObject(value)) return '[complex value]';
  if (_.isString(value)) return `'${value}'`;

  return value;
};

const lineBuilders = {
  removed: (ancestors) => `Property '${ancestors.join('.')}' was removed`,
  added: (ancestors, { value }) => (
    `Property '${ancestors.join('.')}' was added with value: ${stringify(value)}`
  ),
  modified: (ancestors, { oldValue, newValue }) => (
    `Property '${ancestors.join('.')}' was updated from ${stringify(oldValue)} to ${stringify(newValue)}`
  ),
  nested: (ancestors, { children }, iteratee) => iteratee(children, ancestors),
};

export default (diffTree) => {
  const iter = (nodes, ancestors) => nodes
    .filter(({ type }) => type !== 'unmodified')
    .map((node) => {
      const buildLine = lineBuilders[node.type];
      const newAncestors = [...ancestors, node.key];

      return buildLine(newAncestors, node, iter);
    })
    .join('\n');

  return iter(diffTree, []);
};
