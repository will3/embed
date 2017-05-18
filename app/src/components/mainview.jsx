import React from 'react';
import EmbedView from './embedview';
const uuid = require('uuidv4');

class View {
	constructor(params) {
		params = params || {};
		this.uuid = uuid();
		this.left = params.left || 0;
		this.top = params.top || 0;
		this.width = params.width || 1;
		this.height = params.height || 1;
		this.aspect = params.aspect || (16 / 9);
		this.depth = params.depth || 0;
		this.children = [];
	}

	split(vertically) {
		vertically = vertically || false;

		if (vertically) {

		} else {
			// horizontally
			
		}
	}

	traverse(callback) {
		const stop = callback(this);
		if (stop) return true;
		for (let i = 0; i < this.children.length; i++) {
			const stop = this.children[i].traverse(callback);
			if (stop) return true;
		}
	}
}

class MainView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			root: new View()
		}
	}

	findViewToAdd() {
		let found;
		this.state.root.traverse((view) => {
			if (view.video == null) {
				found = view;
				return stop;
			}
		});

		return found;
	};

	addVideo(video) {
		let view = this.findViewToAdd();

		if (view != null) {
			view.video = video;
			this.forceUpdate();
			return;	
		}
	}

	render() {
		const views = [];
		this.state.root.traverse((view) => {
			views.push(
				<div key={view.uuid} style={{
					left: view.left * 100 + '%',
					top: view.top * 100 + '%',
					width: view.width * 100 + '%',
					height: view.height * 100 + '%',
					border: '1px solid #000',
					boxSizing: 'border-box'
				}}>
					<EmbedView video={view.video}/>
				</div>
			);
		});

		return (
			<div style={{
				width: '100%',
				height: '100%'
			}}>
				{views}
			</div>
		);
	}
}

export default MainView;