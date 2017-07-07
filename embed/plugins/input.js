const cheerio = require('cheerio');
var readString = require('../readstring');

module.exports = (params) => {
  const result = params.result;
  const $ = params.$;

  $('*').each(function(i, selected) {
    readElement(this, selected, result);
  });
};

const readElement = (el, selected, result) => {
  if (el.type === 'tag' && el.name === 'textarea') {
    const value = cheerio(el).val();
    if (value != null && value.length > 0) {
      readString(value, result, {
        inputValue: true
      });
    }
  }

  if (el.type === 'tag' && el.name === 'input') {
    const value = cheerio(el).val();
    if (value != null && value.length > 0) {
      readString(value, result, {
        inputValue: true
      });
    }
  }
};
