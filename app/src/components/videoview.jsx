import React from 'react';

class VideoView extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			hover: false
		};

		this.onMouseLeave = this.onMouseLeave.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
	}

	onMouseLeave() {
		this.setState({
			hover: false
		});
	}

	onMouseMove() {
		this.setState({
			hover: true
		});
	}

	render() {
		const video = this.props.video;
		const hover = this.state.hover;

		const imageWidth = 233;
		const imageHeight = 131;

		const overlay = (
			<div style={{
				position: 'absolute',
				left: 0,
				top: 0,
				width: imageWidth,
				height: imageHeight,
				backgroundColor: 'rgba(0, 0, 0, 0.7)',
				visibility: hover ? 'visible' : 'hidden'
			}} onClick={this.props.onAddVideo}>
				<div style={{
					color: '#FFF',
					fontSize: 24,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					width: '100%',
					height: '100%'
				}}>
					<div>
						<i className="fa fa-plus-circle" aria-hidden="true"></i>
					</div>
				</div>
			</div>
		);

		return (
			<div style={{
				width: '100%',
				height: '100%'
			}} 
			onMouseLeave={this.onMouseLeave}
			onMouseMove={this.onMouseMove}>
				<div style={{
					margin: 12,
					position: 'relative'
				}}>
					<img style={{
						width: imageWidth,
						height: imageHeight,
						position: 'relative',
						objectFit: 'cover'
					}} src={video.images[0].url} />

					{overlay}

					<div style={{
						fontSize: 12,
						height: 28,
						textOverflow: 'ellipsis',
						width: '100%',
						overflow: 'hidden'
					}}>
						{video.title}
					</div>
				</div>
			</div>
		);
	}
}

export default VideoView;