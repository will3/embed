const loadPage = require('./loadpage');
const readBody = require('./readbody');
const getRelatedVideos = require('./related');

const embed = (url, params) => {
  params = params || {};
  params.url = url;

  return loadPage(url, params)
  .then(function(r) {
    const result = readBody(r.body, params);
    result.related = getRelatedVideos(r.body, url);
    return result;
  });
}

module.exports = embed;
