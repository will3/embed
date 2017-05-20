const test = require('./utils/test');

// Not responsive
// iframely seems to hardcode this
// src: "https://securea.mlb.com/shared/video/embed/embed.html?content_id=" + content_id + "&topic_id=" + topic_id + "&property=" + property + '&',
// 
test('mlb.com', 'http://m.mlb.com/video/topic/33521662/v499312583/marcia-gay-harden-joins-express-written-consent',
	'https://securea.mlb.com/shared/flash/video_playback/V1/R2/ObjectEmbedFrame.swf?content_id=499312583&property=mlb&width=400&height=224&topic_id=33521662&c_id=mlb&featureSet=fb&secure=true');

test('mlb.com', 'http://m.braves.mlb.com/atl/video/v817982083/cinatl-inciarte-plates-smith-on-rbi-double/?partnerId=as_atl_20160615_62794946&adbid=743228864080424961&adbpl=tw&adbpr=21436663',
	'https://securea.mlb.com/shared/flash/video_playback/V1/R2/ObjectEmbedFrame.swf?content_id=817982083&property=mlb&width=400&height=224&topic_id=8878972&c_id=mlb&featureSet=fb&secure=true');