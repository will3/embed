const request = require('request');

const userAgent = 'User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11.6) AppleWebKit/538.1 (KHTML, like Gecko) webview Safari/538.1 youku/1.2.1;IKUCID/IKU';

module.exports = function(url) {
	return new Promise(function(resolve, reject) {
    request({
      url: url,
      headers: {
        'User-Agent': userAgent
      }
    }, function(err, res, body) {
      if (err) {
        reject(err);
        return;
      }
      resolve(body);
    });
  });
}