const ogParser = require('og-parser').body;
const getMetaValue = require('../getmetavalue');

module.exports = (params) => {
  const body = params.body;
  const result = params.result;
  const $ = params.$;

  const meta = ogParser(body);
  result.title = meta.title;

  const og = meta.og;

  if (og != null) {
    result.title = result.title || og.title;

    eachValue(og.image, (image) => {
      const imageUrl = getImageUrl(image);

      if (imageUrl == null) {
        return;
      }

      result.images.push({
        url: imageUrl,
        source: { meta: true }
      });
    });

    eachValue(og.video, (video) => {
      if (video.url == null) {
        return;
      }

      result.videos.push({
        url: video.url,
        width: video.width,
        height: video.height,
        type: video.type,
        source: { meta: true }
      });
    });
  }

  const twitter = meta.twitter;

  if (twitter != null) {
    result.title = result.title || twitter.title;
    result.description = result.description || twitter.description;

    eachValue(twitter.image, (image) => {
      const imageUrl = getImageUrl(image);

      if (imageUrl == null) {
        return;
      }

      result.images.push({
        url: imageUrl,
        source: { meta: true, twitterPlayer: true }
      });
    });

    eachValue(twitter.player, (player) => {
      result.videos.push({
        url: player.name,
        width: player.width,
        height: player.height,
        source: { meta: true, twitterPlayer: true }
      });
    });
  }

  result.site_name = (og || {}).site_name || getTwitterSite(twitter) || getMetaValue($("meta[name='application-name']"));
};

const eachValue = (value, callback) => {
  if (value == null) {
    return;
  }
  value = Array.isArray(value) ? value : [value];
  value.forEach(callback);
};

const getImageUrl = (image) => {
  return image.url || image.src || image;
};

const getTwitterSite = (twitter) => {
  if (twitter == null || twitter.site == null || twitter.site.name == null) {
    return null;
  }

  const siteName = twitter.site.name;
  if (siteName.substring(0, 1) === '@') {
    return siteName.substring(1);
  }
  return siteName;
};
