import React from 'react';
import Input from './input';

class SmartInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			edit: false
		};

		this.onLabelClick = this.onLabelClick.bind(this);
		this.onBlur = this.onBlur.bind(this);
	}

	onLabelClick() {
		this.setState({
			edit: true
		});
		setTimeout(() => {
			this.refs.input.select();
		});
	}

	onBlur() {
		this.setState({
			edit: false
		});
	}

	render() {
		const label = this.props.label || '';

		const showLabel = label.length > 0 && !this.state.edit;

		const inputStyle = {
			border: 'none',
			outline: 'none',
			fontSize: 12,
			height: '100%',
			width: '100%'
		};

		return (
			<div style={{
				width: '100%',
				height: '100%',
				position: 'relative',
				backgroundColor: '#FFF'
			}}>
				<div style={{
					visibility: showLabel > 0 ? 'hidden' : 'visible',
					height: '100%'
				}}>
					<Input 
					ref='input'
					style={inputStyle} 
					value={this.props.value} 
					selectOnClick={this.props.selectOnClick}
					onValue={this.props.onValue}
					placeholder='Paste a url here'
					onBlur={this.onBlur}/>
				</div>
				<div style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 0,
					bottom: 0,
					fontSize: 12,
					visibility: showLabel > 0 ? 'visible' : 'hidden',
					display: 'flex',
					alignItems: 'center'
				}} onClick={this.onLabelClick}>
					<div>
						{label}
					</div>
				</div>
			</div>
		);
	}
}

export default SmartInput;