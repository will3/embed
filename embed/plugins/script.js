const cheerio = require('cheerio');
var readString = require('../readstring');

module.exports = (params) => {
  const result = params.result;
  const $ = params.$;

  $('*').each(function(i, selected) {
    readElement(this, selected, result);
  });
};

const readElement = (el, selected, result) => {
  if (el.type === 'script' && el.name === 'script') {
    const html = cheerio(el).html();
    readScript(html, result);
  }

  for (name in el.attribs) {
    value = el.attribs[name];

    if (name === 'data-react-props') {
      readScript(value, result);
    }
  }
};

const getScriptStrings = (script, callback) => {
  const evaluateString = (string) => {
    // Skip read if no key words 
    if (string.indexOf('iframe') === -1 &&
      string.indexOf('embed') === -1 &&
      string.indexOf('swf') === -1
    ) {
      return;
    }

    // Use eval to unescape string literals
    try {
      string = eval(string);
      callback(string);
    } catch (err) {}
  };

  const quotedStrings = (script.match(/"[^"\\]*(?:\\.[^"\\]*)*"/g) || []).forEach((string) => {
    evaluateString(string);
  });

  const singleQuotedStrings = (script.match(/'[^'\\]*(?:\\.[^'\\]*)*'/g) || []).forEach((string) => {
    evaluateString(string);
  });
}

const readScript = (script, result) => {
  getScriptStrings(script, (string) => {
    readString(string, result, { script: true });
  });
};
