import React from 'react';
import $ from 'jquery';

class ShareView extends React.Component {
	componentDidMount() {
		$(this.refs.input).select();	
	}

	render() {
		const width = 300;
		const height = 44;
		return (
			<div style={{
				width: width,
				border: '1px solid #CCC',
				backgroundColor: '#FFF',
				paddingLeft: 12,
				paddingRight: 12,
				paddingTop: 12
			}}>
				<div style={{
					color: '#999999',
					marginBottom: 12
				}}>Embed</div>
				<div style={{
					marginBottom: 12
				}}>
					<input 
					style={{
						height: 24,
						width: '100%',
						outline: 'none',
						boxSizing: 'border-box'
					}} 
					defaultValue={this.props.embedCode}
					ref='input' 
					type='text'
					spellcheck='false'>
					</input>
				</div>
			</div>
		);
	}
};

export default ShareView;