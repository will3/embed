import React from 'react';
import logo from '../assets/logo2.png';
import hamburger from '../assets/hamburger.png';
import NavButton from './navbutton';

class NavBar extends React.Component {
	render() {
		const menuButton = null;
		// (
		// 	<div style={{
		// 		display: 'flex',
		// 		alignItems: 'center',
		// 		justifyContent: 'center',
		// 		width: 44,
		// 		height: 44,
		// 		marginLeft: 12
		// 	}} onClick={this.props.onMenuButtonClicked}>
		// 		<img src={hamburger} />
		// 	</div>
		// );
		// 
		const shareButton = this.props.embed ? null :
		<NavButton iconClassName='fa fa-share' onClick={this.props.onShare}/>;

		return (
			<div style={{
				height: this.props.height,
				display: 'flex',
				alignItems: 'center',
				backgroundColor: '#F6F7F7',
				borderBottom: '1px solid #DDD',
				boxSizing: 'border-box'
			}}>
				{menuButton}
				<a style={{
					marginLeft: menuButton == null ? 12 : 0
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
					
				{shareButton}
				<NavButton iconClassName='fa fa-expand' onClick={this.props.onFullScreen}/>
			</div>
		);
	}
}

NavBar.defaultProps = {
	height: 44
};

export default NavBar;