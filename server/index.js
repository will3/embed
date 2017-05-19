const express = require('express');
const app = express();
const embed = require('../embed');
const cors = require('cors');

app.use(cors());

app.get('/search', function(req, res) {
  const url = req.query.url;

  console.log(url);
  embed(url)
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch((e) => {
      console.log(e.stack);
      res.status(400).send({
        error: 'something went wrong'
      });
    });
});

app.use(express.static(__dirname + '/public'));

const port = process.env.PORT || 3001;
app.listen(port);
console.log('Express server started on port %s', port);
