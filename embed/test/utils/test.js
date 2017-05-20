const embed = require('../../index');
const util = require('util');
const requestCache = require('./requestCache');

module.exports = (name, link, expectedLink) => {
  if (Array.isArray(link)) {
    link.forEach((l) => {
      testLink(name, l);
    });
    return;
  }

  testLink(name, link, expectedLink);
};

const testLink = (name, link, expectedLink) => {
  it(name, function(done) {
    this.timeout(20000);

    embed(link, {
      requestCache: requestCache
    }).then(function(result) {
      if (result.videos.length === 0) {
        throw new Error('no way to embed ' + link);
      }

      console.log(util.inspect(result, false, 4));

      if (expectedLink !== undefined) {
        if (expectedLink !== result.videos[0].url) {
          throw new Error('expected first link: ' + expectedLink + ' actual: ' + result.videos[0].url);
        }

        if (result.videos[1] != null && result.videos[0].rating === result.videos[1].rating && result.videos[0].url !== result.videos[1].url) {
          throw new Error('second choice has the same rating as expected link: ' + expectedLink);
        }
      }

      done();
    }).catch(function(err) {
      setTimeout(function() {
        throw err;
      });
    });
  });
}
