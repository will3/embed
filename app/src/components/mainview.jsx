import React from 'react';
import EmbedView from './embedview';
const uuid = require('uuidv4');
import BottomBar from './bottombar';
import screenfull from 'screenfull';

class MainView extends React.Component {
	constructor(props) {
		super(props);

		const results = props.results;

		this.state = {
			views: 
			[{
				left: 0,
				top: 0,
				width: 0.5,
				height: 0.5,
				result: results[0]
			}, {
				left: 0.5,
				top: 0,
				width: 0.5,
				height: 0.5,
				result: results[1]
			}, {
				left: 0,
				top: 0.5,
				width: 0.5,
				height: 0.5,
				result: results[2]
			}, {
				left: 0.5,
				top: 0.5,
				width: 0.5,
				height: 0.5,
				result: results[3]
			}]
		}

		this.onFullScreen = this.onFullScreen.bind(this);
	}

	onFullScreen() {
		if (screenfull.enabled) {
        screenfull.request(this.refs.embedContainer);
    }
	}

	render() {
		const views = this.state.views.map((view, index) => {
			return (
				<div key={index} style={{
					position: 'absolute',
					left: view.left * 100 + '%',
					top: view.top * 100 + '%',
					width: view.width * 100 + '%',
					height: view.height * 100 + '%',
					border: '1px solid #000',
					boxSizing: 'border-box'
				}}>
					<EmbedView 
					result={view.result}
					index={index} />
				</div>
			);
		});

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
					<div ref='embedContainer' style={{
						width: '100%',
						height: '100%'
					}}>
						{views}
					</div>
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