const request = require('request');
const cheerio = require('cheerio')
const URL = require('url-parse');
var Crawler = require("crawler");

var ogs = require('open-graph-scraper');

class Video {
  constructor(params) {
    params = params || {};
    this.embedUrl = params.embedUrl;
    this.swf = params.swf;
    this.width = params.width;
    this.height = params.height;
  }
}

const c = new Crawler({
  maxConnections: 10,
});

const embed = (url, callback) => {
  const result = {
    videos: [],
    url: url
  };

  ogs({
    url: url
  }, function(err, results) {
    if (results.success) {
      result.og = results.data;
      const ogVideo = results.data.ogVideo;
      if (ogVideo != null) {
        result.videos.push(
          new Video({
            embedUrl: ogVideo.url,
            width: ogVideo.width,
            height: ogVideo.height
          })
        );
      }

      const twitterPlayer = results.data.twitterPlayer;
      if (twitterPlayer != null) {
      	result.videos.push(
      		new Video({
      			embedUrl: twitterPlayer.url,
      			width: twitterPlayer.width,
      			height: twitterPlayer.height
      		})
      	);
      }
    }

    readHTML(url, result, callback);
  });
}

const readHTML = (url, result, callback) => {
  c.queue({
    uri: url,
    callback: function(err, res, done) {
      if (err) {
        callback(err);
        return;
      }

      let $ = res.$;

      const num = $('*').length;
      console.info('processing ' + num + ' elements...');

      $('*').each(function() {
        readElement(this, result);
      });

      callback(null, result);
    }
  });
}

const readElement = (element, result) => {
  // TODO fix itemprop
  // let name, value;
  // if (element.attribs['itemprop'] === 'embedUrl') {
  // 	if (element.type === 'tag' && element.name === 'link' && element.attribs['href'] != null) {
  // 		result.embedUrl = element.attribs['href'];
  // 		return;
  // 	}
  // }

  for (name in element.attribs) {
    value = element.attribs[name];
    readValue(value, result);
  }
};

const readValue = (value, result) => {
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
        embedUrl: src,
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
        embedUrl: src,
        width: iframe.attr('width'),
        height: iframe.attr('height')
      }));
    }
  }
}
module.exports = embed;
