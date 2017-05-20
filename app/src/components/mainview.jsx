import React from 'react';
import EmbedView from './embedview';
const uuid = require('uuidv4');
import NavBar from './navbar';
import screenfull from 'screenfull';
import $ from 'jquery';
import storage from '../storage';
import settings from '../settings';

class MainView extends React.Component {
	constructor(props) {
		super(props);

		// const results = props.results;

		const data = storage.get('data') || {};

		this.state = {
			fullscreen: false,
			results: data.results || []
		}

		this.onFullScreen = this.onFullScreen.bind(this);
	}

	componentDidMount() {
		$(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange', (e) => {
      if (!window.screenTop && !window.screenY) {
        // exitFullScreen
        this.setState({
					fullscreen: false
				});
      } else {
        // fullScreen
        this.setState({
					fullscreen: true
				});
      }
    });
	}

	componentWillUnmount() {
		$(document).off('webkitfullscreenchange mozfullscreenchange fullscreenchange');
	}

	onFullScreen() {
		if (settings.mockFullScreen) {
			this._mockFullScreen = !this._mockFullScreen;
			this.setState({
				fullscreen: this._mockFullScreen
			});

			return;	
		}
		
		if (screenfull.enabled) {
        screenfull.request(this.refs.embedContainer);
    }
	}	

	renderViews() {
		const fullscreen = this.state.fullscreen;

		const indexesWithResult = [];
		for (const i = 0; i < 4; i++) {
			if (this.state.results[i] != null) {
				indexesWithResult.push(i);
			}
		}

		if (!this.state.fullscreen || indexesWithResult.length === 0 || indexesWithResult.length === 4) {
			return [
				this.renderView(0, 0, 0, 0.5, 0.5),
				this.renderView(1, 0.5, 0, 0.5, 0.5),
				this.renderView(2, 0, 0.5, 0.5, 0.5),
				this.renderView(3, 0.5, 0.5, 0.5, 0.5)
			];
		}

		if (indexesWithResult.length === 1) {
			return [
				this.renderView(indexesWithResult[0])
			];
		}

		if (indexesWithResult.length === 2) {
			return [
				this.renderView(indexesWithResult[0], 0, 0, 0.5, 1),
				this.renderView(indexesWithResult[1], 0.5, 0, 0.5, 1)
			];
		}

		if (indexesWithResult.length === 3) {
			if (this.state.results[0] != null && this.state.results[2] != null) {
				// left two, right one
				return [
					this.renderView(indexesWithResult[0], 0, 0, 0.5, 0.5),
					this.renderView(indexesWithResult[1], 0, 0.5, 0.5, 0.5),
					this.renderView(indexesWithResult[2], 0.5, 0, 0.5, 1)
				];
			} else {
				return [
					this.renderView(indexesWithResult[0], 0, 0, 0.5, 1),
					this.renderView(indexesWithResult[1], 0.5, 0, 0.5, 0.5),
					this.renderView(indexesWithResult[2], 0.5, 0.5, 0.5, 0.5)
				];
			}
		}
	}

	renderView(index, left, top, width, height) {
		left = left || 0;
		top = top || 0;
		width = width || 1;
		height = height || 1;

		// if (this.state.fullscreen && this.state.results[index] == null) {
		// 	return null;
		// }

		// const otherIndex = 
		// index === 0 ? 2 : 
		// index === 2 ? 0 : 
		// index === 1 ? 3 : 1;

		// const height = only ? '100%' : this.state.fullscreen ? this.state.results[otherIndex] == null ? '100%' : '50%' : '50%';

		// let aspectRatio;
		// const result = this.state.results[index];
		// if (result != null && 
		// 	result.videos.length > 0 && 
		// 	result.videos[0].width > 0 && 
		// 	result.videos[0].height > 0) {
		// 	aspectRatio = result.videos[0].width / result.videos[0].height;
		// }

		const fullscreen = this.state.fullscreen;

		return (
			<div key={index} style={{
				position: 'absolute',
				left: left * 100 + '%',
				top: top * 100 + '%',
				width: width * 100 + '%',
				height: height * 100 + '%',
				boxSizing: 'border-box',
				border: fullscreen ? 'none' : '1px solid #CCC',
				borderTop: index === 0 || index === 1 ? 'none' : undefined,
				borderLeft: index === 1 || index === 2 ? 'none' : undefined
			}}>
				<EmbedView 
				hideTopBar={this.state.fullscreen}
				result={this.state.results[index]}
				onResult={ (result) => {
					this.state.results[index] = result;

					const data = storage.get('data') || {};
					data.results = this.state.results;
					storage.set('data', data);

					this.forceUpdate();
				} }/>
			</div>
		);
	}

	render() {
		let count = 0;
		let found;
		for (let i = 0; i < 4; i++) {
			if (this.state.results[i] != null) {
				count++;
				found = i;
			}
		}

		const views = this.renderViews();

		const embedContainer = (
			<div ref='embedContainer' style={{
				width: '100%',
				height: '100%',
				position: 'relative'
			}}>
				{views}
			</div>
		);

		const barHeight = 44;

		return (
			<div style={{
				width: '100%',
				height: '100%'
			}}>
				<div style={{
					position: 'absolute',
					top: barHeight,
					right: 0,
					bottom: 0,
					left: 0
				}}>
				
					{embedContainer}

				</div>
				
				<div style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0
				}}>
					<NavBar onFullScreen={this.onFullScreen}/>
				</div>
			</div>
		);
	}
}

export default MainView;