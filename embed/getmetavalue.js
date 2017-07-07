const getMetaValue = (element) => {
  return element.attr('content') || element.attr('value');
};

module.exports = getMetaValue;