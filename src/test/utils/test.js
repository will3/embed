const embed = require('../../index');
const validateResult = require('./validateresult');

module.exports = (name, link) => {
  describe(name, function() {
    it(name, function(done) {
      this.timeout(20000);
      embed(link, function(err, result) {
        console.log(err, result);
        validateResult(err, result);
        done();
      });
    });
  });
};