import React from 'react';
import VideoView from './videoview';

class VideoGridView extends React.Component {
	render() {
		const videos = this.props.videos.map((video) => {
			return <VideoView video={video} />
		});
		return (
			<div>
				{videos}
			</div>
		);
	}
}

export default VideoGridView;