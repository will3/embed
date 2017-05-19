var flatCache = require('flat-cache');
var cache = flatCache.load('requestCache');

module.exports = {
  get: (key) => {
  	return cache.getKey(key);
  },
  set: (key, value) => {
		cache.setKey(key, value);
		cache.save(true);
  }
};