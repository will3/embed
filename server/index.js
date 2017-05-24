const express = require('express');
const app = express();
const embed = require('../embed');
const cors = require('cors');

const pool = require('./db');
const shortid = require('shortid');

app.use(cors());

app.get('/search', function(req, res) {
  const url = req.query.url;

  embed(url, {
      autoplay: true
    })
    .then((result) => {
      if (result.videos.length > 1) {
        const video = result.videos[0];

        result.videos = [{
          url: video.url,
          width: video.width,
          height: video.height
        }];
      }

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

app.get('/embed', function(req, res) {
  const id = req.query.id;

  if (id != null) {
    pool.query(
      'SELECT * FROM short_urls WHERE id = $1::text', [id],
      function(err, result) {
        if (err) {
          console.log(err);
          res.status(400).send({
            error: 'something went wrong'
          });
          return;
        }

        res.send(result.rows[0]);
      }
    );

    return;
  }

  const full_url = req.query.full_url;

  if (full_url == null || full_url.length === 0) {
    res.status(400).send({
      error: 'something went wrong'
    });

    return;
  }

  // create table short_urls (id text, full_url text)
  pool.query(
    'SELECT * FROM short_urls WHERE full_url = $1::text', [full_url],
    function(err, result) {
      if (err) {
        console.log(err);
        res.status(400).send({
          error: 'something went wrong'
        });
        return;
      }

      if (result.rows.length === 0) {
        const id = shortid();
        pool.query('INSERT INTO short_urls (id, full_url) VALUES ($1::text, $2::text)', [id, full_url], function(err, result) {
          res.send({
            id: id,
            full_url: full_url
          });
        })
      } else {
        res.send(result.rows[0]);
      }
    });
});

app.use(express.static(__dirname + '/public'));

const port = process.env.PORT || 3001;
app.listen(port);
console.log('Express server started on port %s', port);
