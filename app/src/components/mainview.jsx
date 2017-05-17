import React from 'react';
import Dimensions from 'react-dimensions';

import EmbedView from './embedview';

class MainView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			embeds: [{
				left: 0,
				top: 0,
				width: 1,
				height: 1
			}]
		}
	};

	render() {
		const width = this.props.containerWidth;
		const height = this.props.containerHeight;

		const embeds = this.state.embeds.map((embed, index) => {
			return (
				<div key={index} style={{
					left: embed.left * width,
					top: embed.top * height,
					width: embed.width * width,
					height: embed.height * height,
					border: '1px solid #fff',
					boxSizing: 'border-box'
				}}>
					<EmbedView />
				</div>
			);
		});

		return (
			<div style={{
				width: '100%',
				height: '100%'
			}}>
				{embeds}
			</div>
		);
	}
}

export default Dimensions()(MainView);