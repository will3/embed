const URL = require('url-parse');
const _ = require('lodash');
const heuristics = require('./heuristics');
const getMetaValue = require('./getmetavalue');
const cheerio = require('cheerio');
const parseXml = cheerio.load;

var readString = require('./readstring');

const htmlDecode = require('js-htmlencode').htmlDecode;

const readBody = (body, params) => {
  params = params || {};
  const url = params.url;
  const autoplay = params.autoplay || false;

  const result = {
    images: [],
    videos: []
  };

  let $ = parseXml(body);

  const options = {
    result: result,
    body: body,
    $: $
  };

  require('./plugins')(options);

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

  result.videos = result.videos.sort((a, b) => {
    return b.rating - a.rating;
  });

  for (let i = 0; i < result.images.length; i++) {
    const image = result.images[i];
    image.url = htmlDecode(image.url);
  }

  result.originalUrl = params.url;

  if (result.videos.length > 0) {
    const video = result.videos[0];
    result.video = {
      url: video.url,
      title: video.title,
      description: video.description,
      width: video.width,
      height: video.height,
    };
  }

  if (result.images.length > 0) {
    const thumbnail = result.images[0];
    result.thumbnail = {
      url: thumbnail.url
    };
  }

  delete result.videos;
  delete result.images;

  return result;
};

module.exports = readBody;
