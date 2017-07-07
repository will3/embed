const jaccard = require('jaccard');
const URL = require('url-parse');
const _ = require('lodash');

const getVideoRating = (video, params) => {
  params = params || {};
  const srcUrlParts = params.srcUrlParts;

  let value = 0;

  if (srcUrlParts != null) {
    const a = _.without(new URL(video.url).pathname.split('/'), '');
    const pathRating = jaccard.index(a, srcUrlParts);
    value += pathRating;
  }

  const url = new URL(video.url);

  if (url.pathname.indexOf('embed') !== -1) {
    value += 1;
  }

  if (url.query.indexOf('autoplay') !== -1) {
    value += 1;
  }

  const source = video.source;

  if (source.meta) {
    value += 100;
  }

  if (source.twitterPlayer) {
    value += 50;
  }

  value += video.width * video.height / 1000000;

  return value;
};

module.exports = {
  getVideoRating
};
