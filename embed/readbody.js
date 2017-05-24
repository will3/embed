const URL = require('url-parse');
const _ = require('lodash');
const ogParser = require('og-parser').body;
const heuristics = require('./heuristics');

const cheerio = require('cheerio');
const parseXml = cheerio.load;
const getScriptStrings = require('./utils/getscriptstrings');

const htmlDecode = require('js-htmlencode').htmlDecode;
const strings = require('./utils/strings');

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

const readBody = (body, params) => {
  params = params || {};
  const url = params.url;
  const autoplay = params.autoplay || false;

  const result = {
    images: [],
    videos: []
  };

  let $ = parseXml(body);

  const meta = ogParser(body);

  result.title = meta.title;

  const og = meta.og;

  if (og != null) {
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

  const twitter = meta.twitter;

  if (twitter != null) {
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

  const getTwitterSite = (twitter) => {
    if (twitter == null || twitter.site == null || twitter.site.name == null) {
      return null;
    }

    const siteName = twitter.site.name;
    if (siteName.substring(0, 1) === '@') {
      return siteName.substring(1);
    }
    return siteName;
  };

  result.site_name = (og || {}).site_name || getTwitterSite(twitter) || getMetaValue($("meta[name='application-name']"));

  $('*').each(function(i, selected) {
    readElement(this, selected, result);
  });

  const srcUrlParts = _.without(new URL(url).pathname.split('/'), '');

  for (let i = 0; i < result.videos.length; i++) {
    const video = result.videos[i];
    video.url = htmlDecode(video.url);

    if (autoplay) {
      // Add autoplay to query
      const urlObj = new URL(video.url, true);
      urlObj.query.autoplay = '1';
      video.url = urlObj.toString();
    }

    video.width = video.width || 0;
    video.height = video.height || 0;
    video.rating = heuristics.getVideoRating(video, {
      srcUrlParts: srcUrlParts
    });
  }

  result.videos = _.filter(result.videos, (video) => {
    // Filter out same links
    if (video.url === url) {
      return false;
    }
    return true;
  });

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

  // iframe elements could be ads // TODO look into this
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

  for (name in el.attribs) {
    value = el.attribs[name];

    if (name === 'data-react-props') {
      readScript(value, result);
    }
  }
};

const readString = (value, result, source) => {
  const swf = strings.readUrl(value, 'swf');

  if (swf != null) {
    let s = _.clone(source);
    s.parsed = true;
    result.videos.push({
      url: swf,
      source: s
    });
  }

  const embed = strings.readEmbed(value);

  if (embed != null) {
    let s = _.clone(source);
    s.parsed = true;

    embed.source = s;

    result.videos.push(embed);
  }
}

const readScript = (script, result) => {
  const filter = (string) => {
    if (string.indexOf('iframe') === -1 &&
      string.indexOf('embed') === -1 &&
      string.indexOf('swf') === -1
    ) {
      return false;
    }
    return true;
  }

  getScriptStrings(script, filter).forEach((string) => {
    readString(string, result, { script: true });
  });
}

module.exports = readBody;
