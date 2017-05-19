import React from 'react';

class BottomBar extends React.Component {
	render() {
		return (
			<div style={{
				height: 44,
				display: 'flex',
				alignItems: 'center',
				backgroundColor: '#000',
			}}>
				<div style={{
					flex: 1
				}}>
				</div>
				<div style={{
					fontSize: 24,
        	color: '#FFF',
        	width: 44,
        	height: 44,
        	display: 'flex',
        	justifyContent: 'center',
        	alignItems: 'center'
				}} onClick={this.props.onFullScreen}>
					<i className="fa fa-expand" aria-hidden="true"></i>
				</div>
			</div>
		);
	}
}

export default BottomBar;