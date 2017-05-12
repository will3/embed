const request = require('request');
const cheerio = require('cheerio')
const URL = require('url-parse');
var Crawler = require("crawler");

var ogParse = require('open-graph').parse;

class Video {
  constructor(params) {
    params = params || {};
    this.url = params.url;
    this.swf = params.swf;
    this.width = params.width;
    this.height = params.height;
  }
}

const userAgent = 'User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11.6) AppleWebKit/538.1 (KHTML, like Gecko) webview Safari/538.1 youku/1.2.1;IKUCID/IKU';

const c = new Crawler({
  maxConnections: 10,
  userAgent: userAgent
});

const embed = (url, callback) => {
  const result = {
    videos: [],
    url: url
  };

  readHTML(url, result, callback);
}

const readHTML = (url, result, callback) => {
  console.log('fetching body...');
  c.queue({
    uri: url,
    callback: function(err, res, done) {
      if (err) {
        console.log(err);
        callback(err);
        return;
      }

      let $ = res.$;

      result.body = res.body;

      try {
        console.log('processing og...');
        const og = ogParse(res.body);
        console.log(og);
        if (og.video != null) {
          if (Array.isArray(og.video.url)) {
            for (let i = 0; i < og.video.url.length; i++) {
              result.videos.push(new Video({
                url: og.video.url[i],
                width: og.video.width[i],
                height: og.video.height[i]
              }));
            }
          } else {
            result.videos.push(new Video({
              url: og.video.url,
              width: og.video.width,
              height: og.video.height
            }));
          }
        }
      } catch (err) {
        console.log('Open Graph error: ', err);
      }

      if ($("meta[name='twitter:player']").length > 0) {
        result.videos.push(new Video({
          url: $("meta[name='twitter:player']").attr('content'),
          width: $("meta[name='twitter:player:width']").attr('content'),
          height: $("meta[name='twitter:player:height']").attr('content')
        }));
      }
    //       <meta name="twitter:player" content="https://www.pornhub.com/embed/ph58cccc07d4dbe">
    // <meta name="twitter:player:width" content="640">
    // <meta name="twitter:player:height" content="360">

      const num = $('*').length;
      console.log('processing ' + num + ' elements...');

      $('*').each(function(i, selected) {
        readElement(this, selected, result);
      });

      callback(null, result);
    }
  });
}

const readElement = (element, selected, result) => {
  if (element.type === 'tag' && element.name === 'textarea') {
    const html = $(element).html();
    readString(html, result);
  }

  if (element.type === 'script' && element.name === 'script') {
    const html = $(element).html();
    readScript(html, result);
  }

  for (name in element.attribs) {
    value = element.attribs[name];
    readString(value, result);
  }
};

const readString = (value, result) => {
  const url = new URL(value);

  if (url.host.length > 0) {
    const pathname = url.pathname;
    const ext = pathname.split('.').pop();

    if (ext === 'swf') {
      result.videos.push(new Video({
        swf: url.href
      }));
      return;
    }
  }

  $ = cheerio.load(value);

  // Find embed tag
  const embed = $('embed');
  if (embed.length > 0) {
    const src = embed.attr('src');
    if (src != null) {
      result.videos.push(new Video({
        url: src,
        width: embed.attr('width'),
        height: embed.attr('height')
      }));
    }
  }

  // Find iframe tag
  const iframe = $('iframe');
  if (iframe.length > 0) {
    const src = iframe.attr('src');
    if (src != null) {
      result.videos.push(new Video({
        url: src,
        width: iframe.attr('width'),
        height: iframe.attr('height')
      }));
    }
  }
}

const readScript = (script) => {
  console.log(script);

  const quotedStrings = (script.match(/"[^"\\]*(?:\\.[^"\\]*)*"/g) || []).map((string) => {
    return string.substring(1, string.length - 2);
  });
  const singleQuotedStrings = (script.match(/'[^'\\]*(?:\\.[^'\\]*)*'/g) || []).map((string) => {
    return string.substring(1, string.length - 2);
  });

  console.log(quotedStrings);
  console.log(singleQuotedStrings);
}
module.exports = embed;
