import VideoGridView from './videogridview';
import React from 'react';

const Bing = require('node-bing-api')({ accKey: "5670c56528b94505ad65c23818c14535" });

class SearchResultsView extends React.Component {
	componentDidMount() {
		Bing.video(this.props.query, {
			top: 10,  // Number of results (max 50) 
			skip: 0,  // Skip first 3 result 
			safeSearch: 'Off'
		}, function(error, res, body){
			
		});
	}

	render() {
		const videos = [];
		return (
			<VideoGridView videos={videos} />
		);
	}
}

export default SearchResultsView;