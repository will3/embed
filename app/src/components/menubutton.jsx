import React from 'react';

class MenuButton extends React.Component {
	render() {
		return (
			<div style={{
				width: 44,
				height: 44,
				borderRadius: '50%',
				backgroundColor: '#fff',
				fontSize: 24,
				display:'flex',
				alignItems:'center',
				justifyContent:'center'
			}}>
				{this.props.children}
			</div>
		);
	}
}

export default MenuButton;