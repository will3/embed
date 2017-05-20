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
			result: this.props.result
		};

		this.onValue = this.onValue.bind(this);
		this.onClose = this.onClose.bind(this);

		this.events = container.events;
	}

	onValue(value) {
		search(value).then((result) => {
			result.url = value;
			this.props.onResult(result);
		});		
	}

	onClose() {
		this.props.onResult(null);
	}

	render() {
		const result = this.props.result;

		const embedUrl = result == null ? null : result.videos.length === 0 ? result.url : result.videos[0].url;

		const iframe = result == null ? null : (
			<div style={{
				position: 'absolute',
				left: 0,
				top: this.props.hideTopBar ? 0 : 32,
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
				display: 'flex',
				border: '1px solid #000',
				boxSizing: 'border-box'
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

		const topBar = (result == null || this.props.hideTopBar) ? null : (
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