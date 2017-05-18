import React from 'react';

class EmbedView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			video: null
		}
	}

	render() {
		const video = this.state.video == null ? null : (
			<iframe src={this.state.video.url} style={{
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
				{video}
			</div>
		);
	}
}

export default EmbedView;