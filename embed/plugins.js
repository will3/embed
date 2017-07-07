module.exports = (options) => {
  require('./plugins/og')(options);
  require('./plugins/input')(options);
  require('./plugins/script')(options);
  require('./plugins/iframe')(options);
  require('./plugins/break.com')(options);
};
