import React from 'react';

class EmbedView extends React.Component {
	render() {
		const video = this.props.video;

		const iframe = video == null ? null : (
			<iframe src={video.url} style={{
				width: '100%',
				height: '100%',
				position: 'absolute',
				left: 0,
				top: 0
			}}>
			</iframe>
		);

		return (
			<div>
				{iframe}
			</div>
		);
	}
}

export default EmbedView;