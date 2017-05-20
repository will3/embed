import React from 'react';
import Input from './input';
import logo from '../assets/logo2.png';

class NavBar extends React.Component {
	render() {
		// <div style={{
		// 			marginLeft: 12
		// 		}}>
		// 			<Input style={{
		// 				height: 36,
		// 				padding: 0,
		// 				boxSizing: 'border-box'
		// 			}}/>
		// 		</div>
		return (
			<div style={{
				height: this.props.height - 1,
				display: 'flex',
				alignItems: 'center',
				backgroundColor: '#F6F7F7',
				borderBottom: '1px solid #DDD'
			}}>
				<a style={{
					marginLeft: 12
				}}>
					<img src={logo} />
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