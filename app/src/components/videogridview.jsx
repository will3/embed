import React from 'react';
import howManyColumns from 'how-many-columns';

import VideoView from './videoview';

class VideoGridView extends React.Component {
	render() {
		const result = howManyColumns({
			containerWidth: window.innerWidth
		});
		const videos = this.props.videos.map((video) => {
			return (
				<div style={{
					marginLeft: 15,
					marginTop: 15,
					width: result.columnWidth
				}}>
					<VideoView video={video} />
				</div>
			);
		});
		return (
			<div>
				{videos}
			</div>
		);
	}
}

export default VideoGridView;