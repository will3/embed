import React from 'react';
import EmbedView from './embedview';
const uuid = require('uuidv4');
import BottomBar from './bottombar';
import screenfull from 'screenfull';
import $ from 'jquery';
import storage from '../storage';

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
		if (screenfull.enabled) {
        screenfull.request(this.refs.embedContainer);
    }
	}	

	renderView(index, only) {
		if (this.state.fullscreen && this.state.results[index] == null) {
			return null;
		}

		const otherIndex = 
		index === 0 ? 2 : 
		index === 2 ? 0 : 
		index === 1 ? 3 : 1;

		const height = only ? '100%' : this.state.fullscreen ? this.state.results[otherIndex] == null ? '100%' : '50%' : '50%';

		let aspectRatio;
		const result = this.state.results[index];
		if (result != null && 
			result.videos.length > 0 && 
			result.videos[0].width > 0 && 
			result.videos[0].height > 0) {
			aspectRatio = result.videos[0].width / result.videos[0].height;
		}

		return (
			<div style={{
				height: height,
				width: '100%'
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

		const views = (count === 1 && this.state.fullscreen) ? this.renderView(found, true) : (
			<div ref='embedContainer' style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'row'
			}}>

				<div style={{
					width: '50%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column'	
				}}>

					{this.renderView(0)}
					{this.renderView(2)}

				</div>

				<div style={{
					width: '50%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column'
				}}>

					{this.renderView(1)}
					{this.renderView(3)}

				</div>

			</div>
		);

		return (
			<div style={{
				width: '100%',
				height: '100%'
			}}>
				<div style={{
					position: 'absolute',
					top: 0,
					right: 0,
					bottom: 44,
					left: 0
				}}>
				
					{views}

				</div>
				
				<div style={{
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0
				}}>
					<BottomBar onFullScreen={this.onFullScreen}/>
				</div>
			</div>
		);
	}
}

export default MainView;