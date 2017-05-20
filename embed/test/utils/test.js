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

const testLink = (name, link, params) => {
  let expectedLink;
  if (typeof params === 'string') {
    expectedLink = params;
  } else {
    expectedLink = params.embedLink;
  }

  it(name, function(done) {
    this.timeout(20000);

    let _result;
    embed(link, {
      requestCache: requestCache
    }).then(function(result) {
      _result = result;
      if (result.videos.length === 0) {
        throw new Error('no way to embed ' + link);
      }

      if (expectedLink !== undefined) {
        if (expectedLink !== result.videos[0].url) {
          throw new Error('expected first link: ' + expectedLink + ' actual: ' + result.videos[0].url);
        }

        if (result.videos[1] != null && result.videos[0].rating === result.videos[1].rating && result.videos[0].url !== result.videos[1].url) {
          throw new Error('second choice has the same rating as expected link: ' + expectedLink);
        }
      }

      if (result.title == null) {
        throw new Error('title is missing');
      }

      if (result.site_name == null) {
        console.warn('site name is missing');
      }

      done();
    }).catch(function(err) {
      setTimeout(function() {
        err.message = link + '\n' + err.message;
        console.log(util.inspect(_result, false, 4));
        throw err;
      });
    });
  });
}
