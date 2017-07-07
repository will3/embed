const getMetaValue = require('../getmetavalue');

module.exports = (params) => {
  const body = params.body;
  const result = params.result;
  const $ = params.$;

  // Only found in Break so far...
  if ($("meta[name='embed_video_url']").length > 0) {
    const video = {
      url: getMetaValue($("meta[name='embed_video_url']")),
      title: getMetaValue($("meta[name='embed_video_title']")),
      description: getMetaValue($("meta[name='embed_video_description']")),
      width: getMetaValue($("meta[name='embed_video_width']")),
      height: getMetaValue($("meta[name='embed_video_height']")),
      source: { meta: true }
    };
    result.videos.push(video);
  }

  if ($("meta[name='embed_video_thumb_url']").length > 0) {
    let thumbUrl = getMetaValue($("meta[name='embed_video_thumb_url']"));
    result.images.push({ url: thumbUrl });
  }
};
