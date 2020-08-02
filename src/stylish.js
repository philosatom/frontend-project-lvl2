import _ from 'lodash';

const buildTree = (data) => {
  const entries = Object.entries(data);

  const nodes = entries.map(([key, value]) => {
    if (!_.isPlainObject(value)) {
      return { key, status: 'default', value };
    }

    return { key, status: 'default', children: buildTree(value) };
  });

  return _.sortBy(nodes, ['key']);
};

const prefixes = {
  removed: '-',
  new: '+',
  default: ' '
};

const getFormattedDiff = (diff, depth = 0) => {
  const indent = ' '.repeat(4 * depth);

  const formattedNodes = diff
    .flatMap((node) => {
      if (node.status === 'modified') {
        const { key, oldValue, newValue } = node;
        return [
          { key, status: 'removed', value: oldValue },
          { key, status: 'new', value: newValue }
        ];
      }

      return node;
    })
    .map((node) => {
      if (_.isPlainObject(node.value)) {
        const { key, status, value } = node;
        return { key, status, children: buildTree(value) };
      }

      return node;
    })
    .map((node) => {
      const prefix = prefixes[node.status];
      const newValue = _.has(node, 'children')
        ? getFormattedDiff(node.children, depth + 1)
        : node.value;

      return `  ${prefix} ${node.key}: ${newValue}`;
    });

  return ['{', ...formattedNodes, '}'].join(`\n${indent}`);
};

export default getFormattedDiff;
