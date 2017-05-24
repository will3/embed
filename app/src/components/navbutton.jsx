import React from 'react';

 // fa-share
class NavButton extends React.Component {
	render() {
		return (
			<div style={{
				fontSize: 24,
      	color: '#777',
      	width: 44,
      	height: 44,
      	display: 'flex',
      	justifyContent: 'center',
      	alignItems: 'center'
			}} onClick={this.props.onClick}>
				<i className={this.props.iconClassName} aria-hidden="true"></i>
			</div>
		);
	}
}

export default NavButton;