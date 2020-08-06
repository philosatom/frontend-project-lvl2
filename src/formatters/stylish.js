import _ from 'lodash';

const buildTree = (obj) => {
  const entries = Object.entries(obj);

  const nodes = entries.map(([key, value]) => (
    _.isPlainObject(value) ? { key, children: buildTree(value) } : { key, value }
  ));

  return _.sortBy(nodes, ['key']);
};

const getPrefix = (type) => {
  switch (type) {
    case 'removed':
      return '-';
    case 'added':
      return '+';
    default:
      return ' ';
  }
};

const getFormattedDiff = (diffTree, depth = 0) => {
  const indent = ' '.repeat(4 * depth);

  const formattedNodes = diffTree
    .flatMap((node) => {
      if (node.type !== 'modified') return node;

      const { key, oldValue, newValue } = node;
      return [
        { key, type: 'removed', value: oldValue },
        { key, type: 'added', value: newValue },
      ];
    })
    .map((node) => {
      if (!_.isPlainObject(node.value)) return node;

      const { key, type, value } = node;
      return { key, type, children: buildTree(value) };
    })
    .map((node) => {
      const prefix = getPrefix(node.type);
      const newValue = _.has(node, 'children')
        ? getFormattedDiff(node.children, depth + 1)
        : node.value;

      return `  ${prefix} ${node.key}: ${newValue}`;
    });

  return ['{', ...formattedNodes, '}'].join(`\n${indent}`);
};

export default getFormattedDiff;
