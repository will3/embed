import $ from 'jquery';
import React from 'react';

import search from '../api/search';
const throttle = require('throttle-debounce/throttle');

class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		
		this.onInput = this.onInput.bind(this);
		this._onValue = this._onValue.bind(this);
		this.onValue = throttle(200, this._onValue);
	}

	onInput(e) {
		const value = $(e.target).val();
		this.onValue(value);
	}

	_onValue(value) {
		// search(value).then((result) => {
		// 	if (result.videos.length > 0) {
		// 		this.setState({
		// 			video: result.videos[0]
		// 		});
		// 		$(this.refs.input).val('');
		// 	}
		// });
	}

	render() {
		return (
			<div>
				<input 
          ref='input'
          className='EmbedView-input' 
          type='text' 
          placeholder='Paste a url here' 
          onInput={this.onInput}
          style={{
          	fontSize: 24
          }}
        />
			</div>
		);
	}
}

export default SearchBar;