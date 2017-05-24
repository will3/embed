const getScriptStrings = (script, filter) => {
  const quotedStrings = (script.match(/"[^"\\]*(?:\\.[^"\\]*)*"/g) || []);
  const singleQuotedStrings = (script.match(/'[^'\\]*(?:\\.[^'\\]*)*'/g) || []);

  const strings = quotedStrings.concat(singleQuotedStrings);

  const result = [];

  let string;
  
  for (let i in strings) {
    string = strings[i];

    if (filter != null) {
      if (!filter(string)) {
        continue;
      }
    }

    try {
      string = eval(string);
      result.push(string);
    } catch (err) {}
  }

  return result;
}

module.exports = getScriptStrings;