const express = require('express');
const app = express();
const embed = require('../lib/embed');
const cors = require('cors');

app.use(cors());

app.get('/search', function(req, res) {
  const url = req.query.url;

  embed(url)
    .then((result) => {
      res.json(result);
    })
    .catch((e) => {
      setTimeout(() => {
        throw e;
      });
    });
});

const port = 3001;
app.listen(port);
console.log('Express server started on port %s', port);
