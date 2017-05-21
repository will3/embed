import React from 'react';
import logo from '../assets/logo2.png';
import hamburger from '../assets/hamburger.png';

class NavBar extends React.Component {
	render() {
		return (
			<div style={{
				height: this.props.height,
				display: 'flex',
				alignItems: 'center',
				backgroundColor: '#F6F7F7',
				borderBottom: '1px solid #DDD',
				boxSizing: 'border-box'
			}}>
				<div style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					width: 44,
					height: 44,
					marginLeft: 12
				}} onClick={this.props.onMenuButtonClicked}>
					<img src={hamburger} />
				</div>
				<a style={{
					marginLeft: 0
				}}>
					<div style={{
						display: 'flex',
						alignItems: 'center'
					}}>
						<img src={logo} />
					</div>
				</a>
			
				<div style={{
					flex: 1
				}}>
				</div>
				
				<div style={{
					fontSize: 24,
        	color: '#777',
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

NavBar.defaultProps = {
	height: 44
};

export default NavBar;