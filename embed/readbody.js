const URL = require('url-parse');
const _ = require('lodash');
const ogParser = require('og-parser').body;
const heuristics = require('./heuristics');

const cheerio = require('cheerio');
const parseXml = cheerio.load;

const htmlDecode = require('js-htmlencode').htmlDecode;

const eachValue = (value, callback) => {
  if (value == null) {
    return;
  }
  value = Array.isArray(value) ? value : [value];
  value.forEach(callback);
};

const getImageUrl = (image) => {
  return image.url || image.src || image;
};

const readBody = (body, url) => {
  const result = {
    images: [],
    videos: []
  };

  let $ = parseXml(body);

  const meta = ogParser(body);
  result.title = meta.title;

  if (meta.og != null) {
    const og = meta.og;

    result.title = result.title || og.title;

    eachValue(og.image, (image) => {
      const imageUrl = getImageUrl(image);

      if (imageUrl == null) {
        return;
      }

      result.images.push({
        url: imageUrl,
        source: { meta: true }
      });
    });

    eachValue(og.video, (video) => {
      if (video.url == null) {
        return;
      }

      result.videos.push({
        url: video.url,
        width: video.width,
        height: video.height,
        type: video.type,
        source: { meta: true }
      });
    });
  }

  if (meta.twitter != null) {
    const twitter = meta.twitter;

    result.title = result.title || twitter.title;
    result.description = result.description || twitter.description;

    eachValue(twitter.image, (image) => {
      const imageUrl = getImageUrl(image);

      if (imageUrl == null) {
        return;
      }

      result.images.push({
        url: imageUrl,
        source: { meta: true, twitterPlayer: true }
      });
    });

    eachValue(twitter.player, (player) => {
      result.videos.push({
        url: player.name,
        width: player.width,
        height: player.height,
        source: { meta: true, twitterPlayer: true }
      });
    });
  }

  // Only found in Break so far...
  if ($("meta[name='embed_video_url']").length > 0) {
    const video = {
      url: getMetaValue($("meta[name='embed_video_url']")),
      thumbUrl: getMetaValue($("meta[name='embed_video_thumb_url']")),
      title: getMetaValue($("meta[name='embed_video_title']")),
      description: getMetaValue($("meta[name='embed_video_description']")),
      width: getMetaValue($("meta[name='embed_video_width']")),
      height: getMetaValue($("meta[name='embed_video_height']")),
      source: { meta: true }
    };
    result.videos.push(video);
  }

  $('*').each(function(i, selected) {
    readElement(this, selected, result);
  });

  const srcUrlParts = _.without(new URL(url).pathname.split('/'), '');

  for (let i = 0; i < result.videos.length; i++) {
    const video = result.videos[i];
    video.url = htmlDecode(video.url);
    video.width = video.width || 0;
    video.height = video.height || 0;
    video.rating = heuristics.getVideoRating(video, {
      srcUrlParts: srcUrlParts
    });
  }

  for (let i = 0; i < result.images.length; i++) {
    const image = result.images[i];
    image.url = htmlDecode(image.url);
  }

  result.videos = result.videos.sort((a, b) => {
    return b.rating - a.rating;
  });

  return result;
};

const getMetaValue = (element) => {
  return element.attr('content') || element.attr('value');
}

const readElement = (el, selected, result) => {
  if (el.type === 'script' && el.name === 'script') {
    const html = cheerio(el).html();
    readScript(html, result);
  }

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

  // for (name in el.attribs) {
  //   value = el.attribs[name];
  //   source = { el: el.name, attr: name };

  //   readString(value, result, source);
  // }
};

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

const getScriptStrings = (script, callback) => {
  const evaluateString = (string) => {
    // Skip read if no key words 
    if (string.indexOf('iframe') === -1 &&
      string.indexOf('embed') === -1 &&
      string.indexOf('swf') === -1
    ) {
      return;
    }

    // Use eval to unescape string literals
    try {
      string = eval(string);
      callback(string);
    } catch (err) {}
  };

  const quotedStrings = (script.match(/"[^"\\]*(?:\\.[^"\\]*)*"/g) || []).forEach((string) => {
    evaluateString(string);
  });

  const singleQuotedStrings = (script.match(/'[^'\\]*(?:\\.[^'\\]*)*'/g) || []).forEach((string) => {
    evaluateString(string);
  });
}

const readScript = (script, result) => {
  getScriptStrings(script, (string) => {
    readString(string, result, { script: true });
  });
}

module.exports = readBody;