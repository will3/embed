var page = require('webpage').create();
var system = require('system');

const url = system.args[1];

page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';

page.onConsoleMessage = function(msg) {
  console.log(msg);
};

console.log('opening ' + url + '...');
page.open(url, function(status) {
	// console.log('evaluating scripts...');
 //  page.evaluate(function() {
 //    console.log(document.body);
 //  });
  phantom.exit();
});
