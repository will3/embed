const _ = require('lodash');
const URL = require('url-parse');
const cheerio = require('cheerio');
const parseXml = cheerio.load;

const readString = (value, result, source) => {
  const url = new URL(value);

  if (url.host.length > 0) {
    const pathname = url.pathname;
    const ext = pathname.split('.').pop();

    if (ext === 'swf') {
      let s = _.clone(source);
      s.parsed = true;
      result.videos.push({
        url: url.href,
        source: s
      });
    }
  }

  let $ = parseXml(value);

  // Find embed tag
  const embed = $('embed');
  if (embed.length > 0) {
    const src = embed.attr('src');
    if (src != null) {
      let s = _.clone(source);
      s.parsed = true;
      const video = {
        url: src,
        width: embed.attr('width'),
        height: embed.attr('height'),
        source: s
      };
      result.videos.push(video);
    }
  }

  // Find iframe tag
  const iframe = $('iframe');
  if (iframe.length > 0) {
    const src = iframe.attr('src');
    if (src != null) {
      let s = _.clone(source);
      s.parsed = true;
      const video = {
        url: src,
        width: iframe.attr('width'),
        height: iframe.attr('height'),
        source: s
      };
      result.videos.push(video);
    }
  }
}

module.exports = readString;