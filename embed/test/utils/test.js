const embed = require('../../index');
const util = require('util');
const requestCache = require('./requestCache');
const chai = require('chai');
const expect = chai.expect;
const chaiJestSnapshot = require('chai-jest-snapshot');
chai.use(chaiJestSnapshot);

// To refresh all snapshots
// CHAI_JEST_SNAPSHOT_UPDATE_ALL=true npm test

before(function() {
  chaiJestSnapshot.resetSnapshotRegistry();
});
 
beforeEach(function() {
  chaiJestSnapshot.configureUsingMochaContext(this);
});

module.exports = (name, link, expectedLink) => {
  if (Array.isArray(link)) {
    link.forEach((l) => {
      testLink(name, l);
    });
    return;
  }

  testLink(name, link, expectedLink);
};

const testLink = (name, link, result) => {
  it(name, function(done) {
    this.timeout(20000);

    let _result;
    embed(link, {
      requestCache: requestCache
    }).then(function(r) {
      _result = r;
      expect(r).to.matchSnapshot();
      done();
    }).catch(function(err) {
      setTimeout(function() {
        console.log(util.inspect(_result, { depth: null }));
        throw err;
      });
    });
  });
}
