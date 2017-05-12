const embed = require('../../index');

module.exports = (name, link, expectedLink) => {
  describe(name, function() {
    it(name, function(done) {
      this.timeout(60000);

      embed(link).then(function(result) {
        if (result.videos.length === 0) {
          throw new Error('no way to embed ' + result.url);
        }

        const info = result.videos.map((video) => {
          return video.format();
        }).join('\n');
        console.log('found ' + result.videos.length + ' source(s):');
        console.log(info);

        if (expectedLink !== undefined) {
          if (expectedLink !== result.videos[0].url) {
            throw new Error('first link does not match ' + expectedLink);
          }

          if (result.videos[1] != null && result.videos[0].priority === result.videos[1].priority) {
            throw new Error('second choice has the same priority as expected link: ' + expectedLink);
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
