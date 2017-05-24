const URL = require('url-parse');
const cheerio = require('cheerio');
const parseXml = cheerio.load;
const _ = require('lodash');

const readUrl = (value, ext) => {
  const url = new URL(value);

  if (url.host.length > 0) {
    const pathname = url.pathname;
    const ext = pathname.split('.').pop();

    if (ext === ext) {
      return url.href;
    }
  }
}

const readEmbed = (value) => {
  let $ = parseXml(value);

  const iframe = $('iframe');

  if (iframe.length > 0) {
    const src = iframe.attr('src');
    if (src != null) {
      return {
        url: src,
        width: iframe.attr('width'),
        height: iframe.attr('height')
      };
    }
  }

  const embed = $('embed');

  if (embed.length > 0) {
    const src = embed.attr('src');
    if (src != null) {
      return {
        url: src,
        width: embed.attr('width'),
        height: embed.attr('height')
      };
    }
  }
}

module.exports = {
  readUrl, readEmbed
}