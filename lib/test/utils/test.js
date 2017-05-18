const embed = require('../../embed');
const util = require('util');

module.exports = (name, link, expectedLink) => {
  describe(name, function() {
    it(name, function(done) {
      this.timeout(20000);

      embed(link).then(function(result) {
        if (result.video.length === 0) {
          throw new Error('no way to embed ' + result.url);
        }

        console.log(util.inspect(result, false, 4));

        if (expectedLink !== undefined) {
          if (expectedLink !== result.video[0].url) {
            throw new Error('first link does not match ' + expectedLink);
          }

          if (result.video[1] != null && result.video[0].rating === result.video[1].rating) {
            throw new Error('second choice has the same rating as expected link: ' + expectedLink);
          }
        }

        done();
      }).catch(function(err) {
        setTimeout(function() {
          throw err; });
      });
    });
  });
};
