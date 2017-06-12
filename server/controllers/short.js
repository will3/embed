const shortid = require('shortid');

const store = require('../store');

module.exports = (app) => {
  // Create
  app.post('/short', function(req, res) {
    const urls = req.body.urls;
    const key = urls.join(',');
    let shortUrls;
    store.connect()
      .then((db) => {
        shortUrls = db.collection('shortUrls');
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
        console.log(err);
        res.status(400).send({
          error: 'something went wrong'
        });
      });
  });

  app.get('/short', function(req, res) {
    const shortId = req.query.shortId;

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
      });

  });
};
