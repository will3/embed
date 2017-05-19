import React from 'react';
import Input from './input';

class EmbedBar extends React.Component {
	render() {
		return (
			<div style={{
				display: 'flex',
				boxSizing: 'border-box',
				height: 32
			}}>
				<Input style={{
					border: 'none',
					outline: 'none',
					fontSize: 12,
					height: '100%',
					padding: 0,
					paddingLeft: 4,
					flex: 1,
					placeholder: 'Paste a url here',
					boxSizing: 'border-box'
				}} 
				value={this.props.text}
				selectOnClick={true} 
				onValue={this.props.onValue} />

				<div style={{
					fontSize: 16,
					width: 32,
					height: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: '#FFF'
				}} onClick={this.props.onClose}>
					<i className="fa fa-times" aria-hidden="true"></i>
				</div>
			</div>
		);
	}
}

export default EmbedBar;