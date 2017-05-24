const cheerio = require('cheerio');
const parseXml = cheerio.load;
const libUrl = require('url');
const getScriptStrings = require('./utils/getscriptstrings');
const strings = require('./utils/strings');
const _ = require('lodash');
const heuristics = require('./heuristics');
const URL = require('url-parse');

const getRelatedVideos = (body, url) => {
  let $ = parseXml(body);
  const links = $('a');
  let results = [];

  links.each(function(i, selected) {
    const el = cheerio(this);

    // Not related video if no image
    const img = el.find('img');
    if (img.length === 0) {
      return;
    }

    const getonscreenover = (img) => {
      const onscreenover = img.attr('onscreenover');
      if (onscreenover == null) {
        return null;
      }

      const values = getScriptStrings(onscreenover);

      for (let i = 0; i < values.length; i++) {
        const url = strings.readUrl(values[i], 'jpg');
        if (url != null) {
          return url;
        }
      }
    };

    let src =
      img.attr('data-thumb') || // Youtube
      img.attr('data-image') || // Pornhub
      img.attr('lazysrc') || // sohu
      getonscreenover(img) || // www.metacafe.com
      img.attr('src');

    console.log(el.html());

    if (src == null) {
      console.log(img);
      throw 'Failed to extract src from img, something s wrong here';
    }

    src = libUrl.resolve(url, src);

    const href = libUrl.resolve(url, el.prop('href'));

    results.push({
      url: href,
      thumb: src
    });
  });

  if (results.length === 0) {
    return [];
  }

  const srcUrlParts = _.without(new URL(url).pathname.split('/'), '');

  results.forEach((result) => {
    const rating = heuristics.getPathRating(result.url, srcUrlParts);  
    result.rating = rating;
  });
  
  results = results.sort((a, b) => {
    return b.rating - a.rating;
  });

  const bestRating = results[0].rating;

  results = _.filter(results, (result) => {
    return result.rating === bestRating;
  });

  console.log(results);

  return results;
}

module.exports = getRelatedVideos;
