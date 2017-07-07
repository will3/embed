const shortid = require('shortid');

module.exports = (app, config) => {
  const db = config.db;
  const shortUrls = db.collection('shortUrls');

  // Create
  app.post('/short', function(req, res) {
    const urls = req.body.urls;
    const key = urls.join(',');

    shortUrls.find({ key: key }).toArray().then((result) => {
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
    }).catch((err) => {
      console.log(err);
      res.status(400).send({
        error: 'something went wrong'
      });
    });
  });

  app.get('/short', function(req, res) {
    const shortId = req.query.shortId;

    shortUrls.find({ shortId: shortId }).toArray()
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
      });

  });
};
