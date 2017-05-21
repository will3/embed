import React from 'react';
import VideoView from './videoview';
import storage from '../storage';
import _ from 'lodash';

class Slider extends React.Component {
	render() {
		const favs = storage.favs;
		const favourites = _.values(favs.getAll()).map((result, index) => {
			return (
				<VideoView 
				key={index} 
				result={result} 
				onAddVideo={ () => {
					this.props.onAddVideo(result);
				}}/>
			);
		});

		return (
			<div>
				<div style={{
					margin: '12px 12px 12px 12px'
				}}>
					{'Favourites'}
				</div>
				{favourites}
			</div>
		);
	}
}

export default Slider;