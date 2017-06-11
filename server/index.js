const express = require('express');
const compression = require('compression');
const app = express();
const embed = require('../embed');
const cors = require('cors');
const shortid = require('shortid');
const store = require('./store');

app.use(cors());
app.use(compression());

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
  const shortId = req.query.shortId;

  if (shortId != null) {

    // update
    store.connect()
    .then((db) => {
      const shortUrls = db.collection('shortUrls');
      return shortUrls.find({
        shortId: shortId
      }).toArray();
    })
    .then((result) => {
      if (result.length === 0) {
        res.status(400).send({
          error: 'something went wrong'
        });
      } else {
        res.send(result[0]);
      }
    })
    .catch((err) => {
      res.status(400).send({
        error: 'something went wrong'
      });
    });;

    return;
  }

  const urls = req.query.urls;

  if (urls == null || urls.length === 0) {
    res.status(400).send({
      error: 'something went wrong'
    });

    return;
  }

  const key = urls.join(','); 
  store.connect()
    .then((db) => {
      const shortUrls = db.collection('shortUrls');
      return shortUrls.find({
        key: key
      }).toArray();
    })
    .then((result) => {
      if (result.length === 0) {
        const shortUrl = {
          shortId: shortid(),
          urls: urls,
          key: urls.join(',')
        };
        shortUrls.insert(shortUrl);

        res.send(shortUrl);  
      } else {
        res.send(result[0]);
      }
    })
    .catch((err) => {
      res.status(400).send({
        error: 'something went wrong'
      });
    });

  // pg.connect(dbConfig, function(err, client) {
  //   if (err) throw err;

  //   // create table short_urls (id text, urls text)
  //   client.query(
  //     'SELECT * FROM short_urls WHERE urls = $1::text', [urls],
  //     function(err, result) {
  //       if (err) {
  //         console.log(err);
  //         res.status(400).send({
  //           error: 'something went wrong'
  //         });
  //         return;
  //       }

  //       if (result.rows.length === 0) {
  //         const id = shortid();
  //         client.query('INSERT INTO short_urls (id, urls) VALUES ($1::text, $2::text)', [id, urls], function(err, result) {
  //           res.send({
  //             id: id,
  //             urls: urls
  //           });
  //         })
  //       } else {
  //         res.send(result.rows[0]);
  //       }
  //     });
  // });
});

app.use(express.static(__dirname + '/public'));

const port = process.env.PORT || 3001;
app.listen(port);
console.log('Express server started on port %s', port);
