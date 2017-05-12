const request = require('request');
const cheerio = require('cheerio')
const URL = require('url-parse');
var Crawler = require("crawler");
const _ = require('lodash');
var ogParse = require('open-graph').parse;

const Video = require('./video');

const userAgent = 'User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11.6) AppleWebKit/538.1 (KHTML, like Gecko) webview Safari/538.1 youku/1.2.1;IKUCID/IKU';

const c = new Crawler({
  maxConnections: 10,
  userAgent: userAgent
});

const embed = (url) => {
  const result = {
    videos: [],
    url: url
  };

  const getRes = new Promise(function(resolve, reject) {
    c.queue({
      uri: url,
      callback: function(err, res, done) {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      }
    });
  });

  console.info('fetching ' + url + ' ...');
  return getRes.then(function(res) {
    let $ = res.$;

    result.body = res.body;

    try {
      console.info('processing og...');
      const og = ogParse(res.body);
      if (og.video != null && og.video.url) {
        if (Array.isArray(og.video.url)) {
          for (let i = 0; i < og.video.url.length; i++) {
            const video = new Video({
              url: og.video.url[i],
              width: og.video.width[i],
              height: og.video.height[i],
              source: { element: 'meta' }
            });
            result.videos.push(video);
          }
        } else {
          const video = new Video({
            url: og.video.url,
            width: og.video.width,
            height: og.video.height,
            source: { element: 'meta' }
          });
          result.videos.push(video);
        }
      }
    } catch (err) {
      console.info('Open Graph error: ', err);
    }

    const readContentOrValue = (element) => {
      return element.attr('content') || element.attr('value');
    }

    if ($("meta[name='twitter:player']").length > 0) {
      const video = new Video({
        url: readContentOrValue($("meta[name='twitter:player']")),
        width: readContentOrValue($("meta[name='twitter:player:width']")),
        height: readContentOrValue($("meta[name='twitter:player:height']")),
        source: { element: 'meta', twitterPlayer: true }
      })
      result.videos.push(video);
    }

    // Only found in Break so far...
    if ($("meta[name='embed_video_url']").length > 0) {
      const video = new Video({
        url: readContentOrValue($("meta[name='embed_video_url']")),
        thumbUrl: readContentOrValue($("meta[name='embed_video_thumb_url']")),
        title: readContentOrValue($("meta[name='embed_video_title']")),
        description: readContentOrValue($("meta[name='embed_video_description']")),
        width: readContentOrValue($("meta[name='embed_video_width']")),
        height: readContentOrValue($("meta[name='embed_video_height']")),
        source: { element: 'meta' }
      });
      result.videos.push(video);
    }

    const num = $('*').length;
    console.info('processing ' + num + ' elements...');

    $('*').each(function(i, selected) {
      readElement(this, selected, result);
    });

    const originalUrlParts = _.without(new URL(url).pathname.split('/'), '');

    for (let i = 0; i < result.videos.length; i++) {
      const video = result.videos[i];
      video.updatePathSimilarity(originalUrlParts);
    }

    // Get unique videos
    const map = {};
    for (let i = 0; i < result.videos.length; i++) {
      const video = result.videos[i];
      map[video.key] = video;
    }

    const videos = [];
    for (let key in map) {
      videos.push(map[key]);
    }

    // This is for testing
    videos.reverse();

    result.videos = videos.sort((a, b) => {
      return b.priority - a.priority;
    });

    return result;
  });
}

const readElement = (element, selected, result) => {
  if (element.type === 'tag' && element.name === 'textarea') {
    const html = cheerio(element).html();
    readString(html, result, 'textarea');
  }

  if (element.type === 'script' && element.name === 'script') {
    const html = cheerio(element).html();
    readScript(html, result);
  }

  if (element.type === 'tag' && element.name === 'iframe') {
    const url = cheerio(element).attr('src');
    if (url != null) {
      const urlObj = new URL(value);
      if (urlObj.host.length > 0) {
        const width = cheerio(element).attr('width');
        const height = cheerio(element).attr('height');
        const source = { element: 'iframe' };
        const video = new Video({ url, width, height, source });
        result.videos.push(video);
      }
    }
  }

  for (name in element.attribs) {
    value = element.attribs[name];
    source = { element: element.name, attr: name };

    readString(value, result, source);
  }
};

const readString = (value, result, source) => {
  const url = new URL(value);

  if (url.host.length > 0) {
    const pathname = url.pathname;
    const ext = pathname.split('.').pop();

    if (ext === 'swf') {
      let s = _.clone(source);
      s.parsed = 'url';
      result.videos.push(new Video({
        url: url.href,
        source: s
      }));
    }
  }

  $ = cheerio.load(value);

  // Find embed tag
  const embed = $('embed');
  if (embed.length > 0) {
    const src = embed.attr('src');
    if (src != null) {
      let s = _.clone(source);
      s.parsed = 'embed';
      const video = new Video({
        url: src,
        width: embed.attr('width'),
        height: embed.attr('height'),
        source: s
      });
      result.videos.push(video);
    }
  }

  // Find iframe tag
  const iframe = $('iframe');
  if (iframe.length > 0) {
    const src = iframe.attr('src');
    if (src != null) {
      let s = _.clone(source);
      s.parsed = 'iframe';
      const video = new Video({
        url: src,
        width: iframe.attr('width'),
        height: iframe.attr('height'),
        source: s
      });
      result.videos.push(video);
    }
  }
}

const readScript = (script, result) => {
  const quotedStrings = (script.match(/"[^"\\]*(?:\\.[^"\\]*)*"/g) || []).forEach((string) => {
    string = string.substring(1, string.length - 1);
    readString(string, result, {
      element: 'script'
    });
  });

  const singleQuotedStrings = (script.match(/'[^'\\]*(?:\\.[^'\\]*)*'/g) || []).forEach((string) => {
    string = string.substring(1, string.length - 1);
    readString(string, result, {
      element: 'script'
    });
  });
}

module.exports = embed;