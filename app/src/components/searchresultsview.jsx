import VideoGridView from './videogridview';
import React from 'react';
import jquery from 'jquery';

const Bing = require('node-bing-api')({ accKey: "5670c56528b94505ad65c23818c14535" });

class SearchResultsView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			videos: []
		};
	}

	componentDidMount() {
		Bing.video(this.props.query, {
			top: 10,  // Number of results (max 50) 
			skip: 0,  // Skip first 3 result 
			safeSearch: 'Off'
		}, function(error, res, body) {
			let videos = body.value.map((video) => {
				const embedElement = jquery.parseHTML(video.embedHtml);
				const url = embedElement.attr('src');

				return {
					title: video.name,
					desc: video.description,
					originalUrl: video.contentUrl,
					url: url,
					embedHtml: video.embedHtml,
					thumbnail: {
						width: video.width,
						height: video.height,
						url: video.thumbnailUrl
					}
				}
			});
			videos = this.state.videos.concat(videos);
			this.setState({ videos });
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