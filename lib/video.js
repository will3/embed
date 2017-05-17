const _ = require('lodash');
var jaccard = require('jaccard');
const URL = require('url-parse');
const util = require('util');

class Video {
  constructor(params) {
    params = params || {};
    this.url = params.url;
    this.width = params.width || 0;
    this.height = params.height || 0;
    this.source = params.source;
    this.pathSimilarity = 0;
  }

  get key() {
    return [this.url, this.width, this.height, this.priority].join('\n');
  }

  updatePathSimilarity(originalUrlParts) {
    const a = _.without(new URL(this.url).pathname.split('/'), '');
    this.pathSimilarity = jaccard.index(a, originalUrlParts);
  }

  get priority() {
    let value = 0;

    // Rules
    if (this.source.element === 'meta') {
      value += 100;
    }

    if (this.source.twitterPlayer) {
      value += 50;
    }

    if (this.source.element === 'input') {
      value += 10;
    }

    if (this.source.automation) {
      value += 10;
    }

    // Qualitative
    if (this.width > 0 && this.height > 0) {
      value += 1;
    }

    // Heuristics
    const url = new URL(this.url);
    if (url.pathname.indexOf('embed') !== -1) {
      value += 1;
    }

    if (url.query.indexOf('autoplay') !== -1) {
      value += 1;
    }

    value += this.pathSimilarity;

    return value;
  }

  // Nicely print
  format() {
    return this.priority + ' | ' + this.url + ' | ' + this.width + ' | ' + this.height + ' | ' + util.format(this.source);
  }
}

module.exports = Video;