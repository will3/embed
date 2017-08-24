import React from 'react';
import $ from 'jquery';

import './shareview.css';

import settings from '../settings';

class ShareView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedTab: 0,
			loading: false
		}
	}

	componentDidMount() {
		if (this.props.embedUrl != null) {
			$(this.refs.input).focus();
			$(this.refs.input).select();
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.embedUrl != null) {
			$(this.refs.input).focus();
			$(this.refs.input).select();
		}

		if (prevState.selectedTab !== this.state.selectedTab) {
			$(this.refs.input).focus();
			$(this.refs.input).select();		
		}
	}

	onTab(tab) {
		this.setState({
			selectedTab: tab
		});
	}
	
	render() {
		const width = 400;
		const title = 'fourplayer';
		const description = null;
		const picture = null;
		const hashtags = [];
		
		const embedUrl = this.props.embedUrl;
		const embedCode = '<iframe width="560" height="315" src="' + embedUrl + '" frameborder="0" allowfullscreen></iframe>';
		const url = embedUrl;

		const input = (
			<input 
			key={'input' + this.state.selectedTab}
			style={{
				height: 24,
				width: '100%',
				outline: 'none',
				boxSizing: 'border-box'
			}} 
			value={this.state.selectedTab === 0 ? embedUrl : embedCode}
			ref='input' 
			type='text'
			spellCheck={false}
			onChange={this.handleChange}
			readOnly /> );
		const content = this.state.loading ? null : (
			<div>
				<div style={{
					marginBottom: 8
				}}>
					<span style={{
						paddingRight: 12,
						color: this.state.selectedTab === 0 ? '#000000' : '#999999'
					}} className='ShareView-tab'
					onClick={this.onTab.bind(this, 1)}>Embed</span>
				</div>

				<div style={{
					marginBottom: 12
				}}>
					{input}
				</div>
			</div>
		);

		return (
			<div style={{
				width: width,
				border: '1px solid #CCC',
				backgroundColor: '#FFF',
				paddingLeft: 12,
				paddingRight: 12,
				paddingTop: 12
			}}>
				{content}
			</div>
		);
	}
};

export default ShareView;