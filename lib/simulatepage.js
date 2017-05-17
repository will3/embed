const phantom = require('phantom');
const util = require('util');

const userAgent = 'User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11.6) AppleWebKit/538.1 (KHTML, like Gecko) webview Safari/538.1 youku/1.2.1;IKUCID/IKU';

module.exports = function(url) {
  let _instance;
  return (async function() {
    const instance = await phantom.create();
    _instance = instance;
    const page = await instance.createPage();

    await page.setting('userAgent', userAgent);
    await page.setting('loadImages', false);
    await page.setting('resourceTimeout', 1000);

    // links_more_btn
    await page.on("onResourceRequested", true, function(requestData, networkRequest) {
      var match = requestData.url.match(/.+\.js/g);

      if (match == null) {
        networkRequest.cancel();
        return;
      }

      console.info('Requesting', requestData.url);
    });

    const status = await page.open(url);
    console.log(status);
    await page.invokeMethod('includeJs', 'http://code.jquery.com/jquery-3.2.1.min.js');

    console.log('evaluate...');
    const result = {};
    const clues = await page.evaluate(function() {
      var clues = [];

      if ($('.links_more_btn').length > 0) {
        $('.links_more_btn').click();

        $('input').each(function(_, el) {
          clues.push({
            type: 'string',
            value: $(el).val(),
            source: {
              element: 'input',
              automation: true
            }
          });
        });
      }

      return clues;
    });

    result.clues = clues;
    console.log('evaluate result', util.format(clues));

    const content = await page.property('content');

    await page.render('test.png');

    result.content = content;
    return result;
  }()).all(function() {
    instance.exit();
  });
}
