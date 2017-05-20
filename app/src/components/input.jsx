import $ from 'jquery';
import React from 'react';
import throttle from 'throttle-debounce/throttle';

class Input extends React.Component {
	constructor(props) {
		super(props);
		this.onValue = this.onValue.bind(this);
		this.onPaste = this.onPaste.bind(this);
		this.onClick = this.onClick.bind(this);
		this._lastValue = null;
	}

	get value() {
		return $(this.refs.input).val();
	}

	focus() {
		$(this.refs.input).focus();
	}	

	select() {
		$(this.refs.input).select();	
	}

	onValue() {
		this.fireValue(this.value);
	}

	onPaste() {
		setTimeout(() => {
			this.fireValue(this.value);
		});
	}

	onClick() {
		if (this.props.selectOnClick) {
			this.select();
		}
	}

	fireValue(value) {
		if (value === this._lastValue || value == null || value.length === 0) {
			return;
		}

		this.props.onValue(value);
		this._lastValue = value;
	}

	render() {
		const style = $.extend({
			outline: 'none',
			fontSize: 12
		}, this.props.style || {});

		return (
			<input 
			style={style}
      ref='input'
      type='text' 
      placeholder={this.props.placeholder || null}
      defaultValue={this.props.value}
      onInput={throttle(200, this.onValue)} 
      onPaste={this.onPaste} 
      onClick={this.onClick}
      onBlur={this.props.onBlur}/>
		);
	}
};

export default Input;