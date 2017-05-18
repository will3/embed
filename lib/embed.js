const loadPage = require('./loadpage');
const readBody = require('./readbody');

const embed = (url) => {
  return loadPage(url)
    .then(function(r) {
      const start = new Date().getTime();
      const result = readBody(r.body, url);
      console.log(new Date().getTime() - start);
      return result;
    });
}

module.exports = embed;
