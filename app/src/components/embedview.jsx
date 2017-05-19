import React from 'react';
import $ from 'jquery';

import SearchBar from './searchbar';
import search from '../api/search';
import Input from './input';
import EmbedBar from './embedbar';
import container from '../container';

class EmbedView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			video: this.props.video,
			hideTopBar: false
		};

		this.onValue = this.onValue.bind(this);
		this.onClose = this.onClose.bind(this);

		this.events = container.events;
	}

	componentDidMount() {
		$(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange', (e) => {
      if (!window.screenTop && !window.screenY) {
        // exitFullScreen
        this.setState({
					hideTopBar: false
				});
      } else {
        // fullScreen
        this.setState({
					hideTopBar: true
				});
      }
    });
	}

	componentWillUnmount() {
		$(document).off('webkitfullscreenchange mozfullscreenchange fullscreenchange');
	}

	onValue(value) {
		search(value).then((result) => {
			if (result.videos.length === 0) {
				this.setState({ video: { url: value } });	
				return;
			}
			this.setState({
				video: result.videos[0]
			});
			this.props.onVideo(result.videos[0]);
		});		
	}

	onClose() {
		this.setState({
			video: null
		});
		this.props.onVideo(null);
	}

	render() {
		const video = this.state.video;

		const iframe = video == null ? null : (
			<div style={{
				position: 'absolute',
				left: 0,
				top: this.state.hideTopBar ? 0 : 32,
				right: 0,
				bottom: 0
			}}>
				<iframe src={video.url} style={{
					width: '100%',
					height: '100%',
					border: 'none'
				}} allowFullScreen frameBorder="0">
				</iframe>
			</div>
		);

		const input = video == null ? (
			<div style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: 0,
				bottom: 0,
				display: 'flex'
			}}>
				<Input onValue={this.onValue} 
				placeholder={'Paste a url here, e.g. https://www.youtube.com/watch?v=BBauxerc6TI'}
				style={{
					flex: 1,
					border: 'none',
					outline: 'none',
					fontSize: 16,
					height: '100%',
					textAlign: 'center',
					padding: 12
				}}/>
			</div>
		) : null;

		const topBar = (video == null || this.state.hideTopBar) ? null : (
			<EmbedBar text={video.url} onClose={this.onClose} onValue={this.onValue} />
		);

		return (
			<div style={{
				backgroundColor: '#F6F6F6',
				width: '100%',
				height: '100%',
				position: 'relative'
			}}>
				{topBar}
				{input}
				{iframe}
			</div>
		);
	}
}

export default EmbedView;