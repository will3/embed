import React from 'react';
import Input from './input';
import SmartInput from './smartinput';

class EmbedBar extends React.Component {
	render() {
		const result = this.props.result;
		const embedLabel = result == null ? null : result.title || '';
		const text = result == null ? null : result.url || '';

		return (
			<div style={{
				display: 'flex',
				boxSizing: 'border-box',
				height: 32
			}}>
				<div style={{
					flex: 1,
					height: '100%',
					padding: 0,
					paddingLeft: 4
				}}>
					<SmartInput
					label={embedLabel}
					value={text}
					selectOnClick={true} 
					onValue={this.props.onValue} />
				</div>
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