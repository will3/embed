import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import URL from 'url-parse';
import qs from 'qs';

const href = window.location.href;
const url = new URL(href);
	
let urls = [];
let embed = false;

if (url.query.length > 0 && url.query.indexOf('?') === 0) {
	const query = qs.parse(url.query.substring(1));
	urls = query.urls;
	embed = query.embed != null;
}

ReactDOM.render(
  <App urls={urls} embed={embed}/>,
  document.getElementById('root')
);


// <iframe width="560" height="315" src=https://fourplayer.herokuapp.com?urls%5B0%5D=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DtnBQmEqBCY0&urls%5B1%5D=&urls%5B2%5D=&urls%5B3%5D= frameborder="0" allowfullscreen></iframe>