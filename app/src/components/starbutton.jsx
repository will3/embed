import React from 'react';

class StarButton extends React.Component {
	render() {
		const starred = this.props.starred;
		const className = starred ? 'fa fa-star' : 'fa fa-star-o';

		return (
			<div style={{
				fontSize: 16,
				width: 32,
				height: 32,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: '#FFF'
			}} onClick={this.props.onClick}>
					<i className={className} aria-hidden="true"></i>
			</div>
		);
	}
}

export default StarButton;