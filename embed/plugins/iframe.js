const cheerio = require('cheerio');
var readString = require('../readstring');
const URL = require('url-parse');

module.exports = (params) => {
  const result = params.result;
  const $ = params.$;

  $('*').each(function(i, selected) {
    readElement(this, selected, result);
  });
};

const readElement = (el, selected, result) => {
  // iframe elements could be ads
  if (el.type === 'tag' && el.name === 'iframe') {
    const url = el.attribs['src'];
    if (url != null) {
      const urlObj = new URL(url);
      if (urlObj.host.length > 0) {
        const width = el.attribs['width'];
        const height = el.attribs['height'];
        const source = { iframe: true };
        result.videos.push({ url, width, height, source });
      }
    }
  }
};