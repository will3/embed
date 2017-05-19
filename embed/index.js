const loadPage = require('./loadpage');
const readBody = require('./readbody');

const embed = (url, params) => {
  params = params || {};

  return loadPage(url, {
    requestCache: params.requestCache
  }).then(function(r) {
    return readBody(r.body, url);
  });
}

module.exports = embed;
