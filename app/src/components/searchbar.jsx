import $ from 'jquery';
import React from 'react';

const throttle = require('throttle-debounce/throttle');

import './searchbar.css';

class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		
		this.onInput = this.onInput.bind(this);
		this._onValue = this._onValue.bind(this);
		this.onValue = throttle(200, this._onValue);
		this.onSearch = this.onSearch.bind(this);
	}

	get value() {
		return $(this.refs.input).val();
	}

	clear() {
		$(this.refs.input).val('');
	}

	onInput(e) {
		this.onValue(this.value);
	}

	onSearch() {
		this.props.onSearch(this.value);
	}

	_onValue(value) {
		// TODO predictive
		
		// search(value).then((result) => {
			// if (result.videos.length > 0) {
				// this.setState({
				// 	video: result.videos[0]
				// });
				// $(this.refs.input).val('');
			// }
		// });
	}

	render() {
		return (
			<div style={{
				height: 32,
				display: 'flex'
			}}>
				<input 
				className='SearchBar-input'
        ref='input'
        type='text' 
        placeholder='Paste a url here, e.g. https://www.youtube.com/watch?v=BBauxerc6TI' 
        onInput={this.onInput} />
        <button 
        className='SearchBar-button'
        style={{
        	height: 32,
        	width: 32
        }}
        onClick={this.onSearch}>
        	<i className="fa fa-link" aria-hidden="true"></i>
        </button>
			</div>
		);
	}
}

export default SearchBar;