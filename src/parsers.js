import yaml from 'js-yaml';

export default {
  '.json': (content) => JSON.parse(content),
  '.yml': (content) => yaml.safeLoad(content)
};
