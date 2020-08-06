import _ from 'lodash';

const buildDiffTree = (data1, data2) => {
  const keys1 = Object.keys(data1);
  const keys2 = Object.keys(data2);
  const allKeys = _.union(keys1, keys2).sort();

  return allKeys.map((key) => {
    const value1 = data1[key];
    const value2 = data2[key];

    if (!_.has(data2, key)) {
      return { key, type: 'removed', value: value1 };
    }

    if (!_.has(data1, key)) {
      return { key, type: 'added', value: value2 };
    }

    if (_.isPlainObject(value1) && _.isPlainObject(value2)) {
      return { key, type: 'nested', children: buildDiffTree(value1, value2) };
    }

    if (JSON.stringify(value1) === JSON.stringify(value2)) {
      return { key, type: 'unmodified', value: value1 };
    }

    return {
      key, type: 'modified', oldValue: value1, newValue: value2,
    };
  });
};

export default buildDiffTree;
