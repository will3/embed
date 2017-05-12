const embed = require('../../index');
const validateResult = require('./validateresult');

module.exports = (name, link) => {
  describe(name, function() {
    it(name, function(done) {
      this.timeout(60000);
      embed(link, function(err, result) {
        validateResult(err, result);
        console.log(result.videos);
        done();
      });
    });
  });
};