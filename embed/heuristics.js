const jaccard = require('jaccard');
const URL = require('url-parse');
const _ = require('lodash');

const getVideoRating = (video, params) => {
  params = params || {};
  const srcUrlParts = params.srcUrlParts;

  let value = 0;

  if (srcUrlParts != null) {
    value += getPathRating(video.url, srcUrlParts);
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

const getPathRating = (url, srcUrlParts) => {
  const a = _.without(new URL(url).pathname.split('/'), '');
  return jaccard.index(a, srcUrlParts);
}

// get priority() {
//   let value = 0;
//   // Rules
//   if (this.source.element === 'meta') {
//     value += 100;
//   }
//   if (this.source.twitterPlayer) {
//     value += 50;
//   }
//   if (this.source.element === 'input') {
//     value += 10;
//   }
//   if (this.source.automation) {
//     value += 10;
//   }
//   // Qualitative
//   if (this.width > 0 && this.height > 0) {
//     value += 1;
//   }
//   // Heuristics
//   value += this.pathSimilarity;
//   return value;
// }

module.exports = {
  getVideoRating,
  getPathRating
};
