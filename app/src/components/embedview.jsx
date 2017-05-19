import React from 'react';
import $ from 'jquery';

import SearchBar from './searchbar';
import search from '../api/search';
import Input from './input';
import EmbedBar from './embedbar';
import container from '../container';

import storage from '../storage';

class EmbedView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			result: this.props.result,
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
			result.url = value;
			this.setState({
				result: result
			});

			const data = storage.get('data') || {};
			data.results = data.results || [];
			data.results[this.props.index] = result;
			storage.set('data', data);
		});		
	}

	onClose() {
		this.setState({
			result: null
		});
		const data = storage.get('data') || {};
		data.results = data.results || [];
		data.results[this.props.index] = null;
		storage.set('data', data);
	}

	render() {
		const result = this.state.result;

		const embedUrl = result == null ? null : result.videos.length === 0 ? result.url : result.videos[0].url;

		const iframe = result == null ? null : (
			<div style={{
				position: 'absolute',
				left: 0,
				top: this.state.hideTopBar ? 0 : 32,
				right: 0,
				bottom: 0
			}}>
				<iframe src={embedUrl} style={{
					width: '100%',
					height: '100%',
					border: 'none'
				}} allowFullScreen frameBorder="0">
				</iframe>
			</div>
		);

		const input = result == null ? (
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

		const topBar = (result == null || this.state.hideTopBar) ? null : (
			<EmbedBar text={result.url || ''} onClose={this.onClose} onValue={this.onValue} />
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