import React from 'react';
import storage from '../storage';
import EmbedView from './embedview';
import screenfull from 'screenfull';
import mixpanel from '../mixpanel';

class EmbedContainer extends React.Component {

	fullscreen() {
		if (screenfull.enabled) {
        screenfull.request(this.refs.root);
    }
	}

	getVideoUrl(index) {
		const result = this.props.results[index];
		if (result == null) {
			return null;
		}
		const video = result.videos[0];
		if (video == null) {
			return null;
		}
		return video.url;
	}

	renderView(index, left, top, width, height) {
		left = left || 0;
		top = top || 0;
		width = width || 1;
		height = height || 1;

		const fullscreen = this.props.fullscreen;
		const key = this.getVideoUrl(index);
		const starred = key == null ? false : storage.favs.has(key);

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
				screenIndex={index}
				hideTopBar={this.props.fullscreen}
				result={this.props.results[index]}
				onResult={ (result) => {
					this.props.results[index] = result;

					const data = storage.get('data') || {};
					data.results = this.props.results;
					storage.set('data', data);

					this.forceUpdate();
				}}
				onStar={ () => {
					const key = this.getVideoUrl(index);
					if (storage.favs.has(key)) {
						storage.favs.remove(key);
						mixpanel.track('unfav', {
							url: key,
							screenIndex: index
						});
					} else {
						storage.favs.add(key, this.props.results[index] );
						mixpanel.track('fav', {
							url: key,
							screenIndex: index
						});
					}
					this.forceUpdate();
				}} 
				starred={starred} />
			</div>
		);
	}

	renderViews() {
		const fullscreen = this.props.fullscreen;

		const indexesWithResult = [];
		for (const i = 0; i < 4; i++) {
			if (this.props.results[i] != null) {
				indexesWithResult.push(i);
			}
		}

		if (!this.props.fullscreen || indexesWithResult.length === 0 || indexesWithResult.length === 4) {
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
			if (this.props.results[0] != null && this.props.results[2] != null) {
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

	render() {
		const views = this.renderViews();
		return (
			<div ref='root' style={{
				width: '100%',
				height: '100%',
				position: 'relative'
			}}>
				{views}
			</div>
		);
	}
};

export default EmbedContainer;