const embed = require('../../embed');

module.exports = (app) => {
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
};