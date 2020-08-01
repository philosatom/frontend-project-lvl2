import _ from 'lodash';

const buildDiffTree = (data1, data2 = data1) => {
  const keys = _.union(Object.keys(data1), Object.keys(data2));

  const nodes = keys.flatMap((key) => {
    const value1 = data1[key];
    const value2 = data2[key];

    if (_.has(data1, key) && !_.has(data2, key)) {
      return { key, status: 'removed', value: value1 };
    }

    if (!_.has(data1, key) && _.has(data2, key)) {
      return { key, status: 'new', value: value2 };
    }

    if (_.isPlainObject(value1) && _.isPlainObject(value2)) {
      return { key, status: 'default', children: buildDiffTree(value1, value2) };
    }

    if (JSON.stringify(value1) === JSON.stringify(value2)) {
      return { key, status: 'default', value: value1 };
    }

    return [
      { key, status: 'removed', value: value1 },
      { key, status: 'new', value: value2 }
    ];
  });

  return _.sortBy(nodes, ['key']);
};

export default buildDiffTree;
