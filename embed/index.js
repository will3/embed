const loadPage = require('./loadpage');
const readBody = require('./readbody');

const embed = (url, params) => {
  params = params || {};
  params.url = url;

  return loadPage(url, params)
  .then(function(r) {
    return readBody(r.body, params);
  });
}

module.exports = embed;
