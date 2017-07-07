const embed = require('../../embed');

module.exports = (app) => {
  app.get('/search', function(req, res) {
    const url = req.query.url;

    embed(url, {
        autoplay: true
      })
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
};