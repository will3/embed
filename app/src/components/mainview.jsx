import React from 'react';
import EmbedView from './embedview';
const uuid = require('uuidv4');
import NavBar from './navbar';
import $ from 'jquery';
import storage from '../storage';
import settings from '../settings';
import Slider from './slider';
import EmbedContainer from './embedcontainer';
import ShareView from './shareview';
import _ from 'lodash';
import qs from 'qs';

import mixpanel from '../mixpanel';

class MainView extends React.Component {
	constructor(props) {
		super(props);

		const data = storage.get('data') || {};

		this.state = {
			fullscreen: false,
			results: data.results || [],
			sliderShown: false,
			shareShown: false
		}

		this.onFullScreen = this.onFullScreen.bind(this);
		this.onMenuButtonClicked = this.onMenuButtonClicked.bind(this);
		this.onSliderOverlayClicked = this.onSliderOverlayClicked.bind(this);
		this.onAddVideo = this.onAddVideo.bind(this);
		this.onShare = this.onShare.bind(this);
	}

	componentDidMount() {
		$(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange', (e) => {
      if (!window.screenTop && !window.screenY) {
        // exitFullScreen
        
        const screenIndexes = [];
        for (let i = 0; i < this.state.results.length; i++) {
        	if (this.state.results[i] != null) {
        		screenIndexes.push(i);
        	}
        }
        mixpanel.track('enter fullscreen', {
        	screenIndexes: screenIndexes
        });

        this.setState({
					fullscreen: false
				});
      } else {
        // fullScreen
        this.setState({
					fullscreen: true
				});
				mixpanel.track('exit fullscreen');
      }
    });
	}

	componentWillUnmount() {
		$(document).off('webkitfullscreenchange mozfullscreenchange fullscreenchange');
	}

	onAddVideo(result) {
		const results = this.state.results;
		for (let i = 0; i < 4; i++) {
			if (results[i] == null) {
				mixpanel.track('add from favourite', {
					url: result.url
				});
				results[i] = result;
				break;
			}
		}
		this.setState({ results });
	}

	onShare() {
		this.setState({
			shareShown: !this.state.shareShown
		});
	}

	onFullScreen() {
		if (settings.mockFullScreen) {
			this._mockFullScreen = !this._mockFullScreen;
			this.setState({
				fullscreen: this._mockFullScreen
			});

			return;	
		}
		
		this.refs.embedContainer.fullscreen();
	}	

	onMenuButtonClicked() {
		if (!this.state.sliderShown) {
			// opening slider...
			mixpanel.track('open slider');
		}
		this.setState({
			sliderShown: !this.state.sliderShown
		});
	}

	onSliderOverlayClicked() {
		this.setState({
			sliderShown: false
		});	
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

		const showNavBar = true;
		const barHeight = showNavBar ? 44 : 0;

		const sliderShown = this.state.sliderShown;
		const sliderWidth = 257;

		const slider = sliderShown ? (
			<div style={{
				position: 'absolute',
				left: 0,
				top: barHeight,
				bottom: 0,
				width: sliderWidth,
				backgroundColor: '#FFF',
				boxShadow: '5px 0 5px rgba(0, 0, 0, 0.05)',
				borderRight: '1px solid #CCC',
				overflow: 'auto'
			}}>
				<Slider onAddVideo={this.onAddVideo}/>
			</div>
		) : null;

		const sliderOverlay = sliderShown ? (
			<div style={{
				position: 'absolute',
				left: sliderWidth,
				top: barHeight,
				bottom: 0,
				right: 0,
				backgroundColor: 'rgba(0, 0, 0, 0.5)'
			}} onClick={this.onSliderOverlayClicked}>
			</div>
		) : null;

		const host = settings.host;
		const query = qs.stringify({
			urls: _.map(this.state.results, function(result) {
				return result == null ? null : result.url
			}),
			embed: true
		});
		const embedUrl = host + '?' + query;
		const embedCode = '<iframe width="560" height="315" src="' + embedUrl + '" frameborder="0" allowfullscreen></iframe>';

		const shareView = this.state.shareShown ? (
			<div style={{
				position: 'absolute',
				right: 20,
				top: 20 + barHeight
			}}>
				<ShareView 
				embedUrl={embedUrl}
				embedCode={embedCode}/>
			</div>
		) : null;

		const navBar = showNavBar ? (
			<div style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0
			}}>
				<NavBar 
				embed={this.props.embed}
				onFullScreen={this.onFullScreen}
				onShare={this.onShare}
				onMenuButtonClicked={this.onMenuButtonClicked}/>
			</div>
		) : null;

		return (
			<div style={{
				width: '100%',
				height: '100%'
			}}>
				
				{navBar}

				<div style={{
					position: 'absolute',
					top: barHeight,
					right: 0,
					bottom: 0,
					left: 0
				}}>
					<EmbedContainer 
					ref='embedContainer'
					fullscreen={this.props.embed || this.state.fullscreen} 
					results={this.state.results} 
					urls={this.props.urls} 
					embed={this.props.embed} />
				</div>

				{slider}
				{sliderOverlay}

				{shareView}
				
			</div>
		);
	}
}

export default MainView;