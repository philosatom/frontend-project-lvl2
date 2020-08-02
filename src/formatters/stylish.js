import _ from 'lodash';

const buildTree = (obj) => {
  const entries = Object.entries(obj);

  const nodes = entries.map(([key, value]) => {
    if (!_.isPlainObject(value)) {
      return { key, value };
    }

    return { key, children: buildTree(value) };
  });

  return _.sortBy(nodes, ['key']);
};

const getPrefix = (status) => {
  switch (status) {
    case 'removed':
      return '-';
    case 'new':
      return '+';
    default:
      return ' ';
  }
};

const getFormattedDiff = (diffTree, depth = 0) => {
  const indent = ' '.repeat(4 * depth);

  const formattedNodes = diffTree
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
      const prefix = getPrefix(node.status);
      const newValue = _.has(node, 'children')
        ? getFormattedDiff(node.children, depth + 1)
        : node.value;

      return `  ${prefix} ${node.key}: ${newValue}`;
    });

  return ['{', ...formattedNodes, '}'].join(`\n${indent}`);
};

export default getFormattedDiff;
