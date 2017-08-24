import React from 'react';
import NavBar from './navbar';
import $ from 'jquery';
import storage from '../storage';
import settings from '../settings';
import Slider from './slider';
import EmbedContainer from './embedcontainer';
import ShareView from './shareview';
import _ from 'lodash';
import createShortUrl from '../api/createshorturl';
import mixpanel from '../mixpanel';
import routes from '../routes';
import SearchResultsView from './searchresultsview';

class MainView extends React.Component {
	constructor(props) {
		super(props);

		storage.set('data', {});

		const data = storage.get('data') || {};

		this.state = {
			fullscreen: false,
			results: data.results || [],
			sliderShown: false,
			shareShown: false,
			embedUrl: null,
			embedUrls: [],
		}

		this.onFullScreen = this.onFullScreen.bind(this);
		this.onMenuButtonClicked = this.onMenuButtonClicked.bind(this);
		this.onSliderOverlayClicked = this.onSliderOverlayClicked.bind(this);
		this.onAddVideo = this.onAddVideo.bind(this);
		this.onShare = this.onShare.bind(this);
		this.onSearch = this.onSearch.bind(this);
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

	componentDidUpdate(prevProps, prevState) {
		const urls = _.map(this.state.results, function(result) {
			return result == null ? null : result.url
		});

		if (this.state.shareShown && 
			(this.state.embedUrl == null || !_.isEqual(this.state.embedUrls, urls))) {
			createShortUrl({
				urls: urls
			})
			.then((result) => {
				const id = result.shortId;
				this.setState({
					embedUrl: settings.embedHost + '#e/' + id,
					embedUrls: urls
				});
			})
			.catch((err) => {
				console.log(err);
			});
		}
	}

	componentWillUnmount() {
		$(document).off('webkitfullscreenchange mozfullscreenchange fullscreenchange');
	}	

	onSearch(value) {
		routes.add('s?q=' + value);
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

		const urls = _.map(this.state.results, function(result) {
			return result == null ? null : result.url
		});

		const shareView = this.state.shareShown ? (
			<div style={{
				position: 'absolute',
				right: 20,
				top: 20 + barHeight
			}}>
				<ShareView 
				ref='shareView'
				urls={urls}
				embedUrl={this.state.embedUrl} />
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
				onMenuButtonClicked={this.onMenuButtonClicked}
				onSearch={this.onSearch}/>
			</div>
		) : null;

		let content;

		switch(this.props.contentType) {
			case 'embed': {
				content = (
					<EmbedContainer 
					ref='embedContainer'
					fullscreen={this.props.embed || this.state.fullscreen} 
					results={this.state.results} 
					urls={this.props.urls} 
					embed={this.props.embed} /> );
			} break;
			case 'searchResults': {
				content = (
					<SearchResultsView 
					query={this.props.query} />
				);
			} break;
		}

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
					{content}
				</div>

				{slider}
				{sliderOverlay}

				{shareView}
				
			</div>
		);
	}
}

export default MainView;