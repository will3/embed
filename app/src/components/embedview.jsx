import React from 'react';

import search from '../api/search';
import Input from './input';
import EmbedBar from './embedbar';
import container from '../container';

import mixpanel from '../mixpanel';

class EmbedView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loadingResult: false
		};

		this.onValue = this.onValue.bind(this);
		this.onClose = this.onClose.bind(this);
		this.onInputClick = this.onInputClick.bind(this);

		this.events = container.events;
	}

	componentDidMount() {
		if (this.props.url != null && this.props.url.length > 0)	{
			this.load(this.props.url);
		}
	}

	onValue(value) {
		this.load(value);
	}

	load(value) {
		this.setState({
			loadingResult: true
		});
		search(value)
		.then((result) => {
			result.url = value;
			this.props.onResult(result);
			if (result.video == null) {
				mixpanel.track('embed no video', {
					url: value,
					screenIndex: this.props.screenIndex
				});
			} else {
				mixpanel.track('embed', {
					url: value,
					screenIndex: this.props.screenIndex
				});
			}
		})
		.finally(() => {
			this.setState({
				loadingResult: false
			});
		});	
	}

	onClose() {
		this.props.onResult(null);
	}

	onInputClick() {
		this.refs.input.focus();
	}

	render() {
		const result = this.props.result;

		const embedUrl = result == null ? null : result.video == null ? result.url : result.video.url;
			
		const topBar = (result == null || this.props.hideTopBar) ? null : (
			<EmbedBar 
			result={result} 
			onClose={this.onClose} 
			onValue={this.onValue} 
			onStar={this.props.onStar} 
			starred={this.props.starred}/>
		);

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

		const loader = this.state.loadingResult ? (
			<div className="loader-inner ball-clip-rotate"><div style={{
				borderColor: '#777',
				borderBottomColor: 'transparent'
			}}></div></div>
		) : null;

		const input = result == null ? (
			<div style={{
				padding: 24,
				position: 'absolute',
				left: 0,
				right: 0,
				top: 0,
				bottom: 0,
				backgroundColor: '#fff',
			}} 
			onClick={this.onInputClick}>
				<div style={{
					display: 'flex',
					boxSizing: 'border-box',
					alignItems: 'center',
					height: '100%'
				}}>
					<div style={{
						flex: 1,
						marginRight: loader == null ? 0 : 12
					}}>
						<Input 
						ref='input' 
						onValue={this.onValue} 
						placeholder={'Paste a url here, e.g. https://www.youtube.com/watch?v=BBauxerc6TI'}
						style={{
							flex: 1,
							border: 'none',
							outline: 'none',
							fontSize: 16,
							height: '100%',
							width: '100%'
						}}/>
					</div>
					{loader}
				</div>
			</div>
		) : null;

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