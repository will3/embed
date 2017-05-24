const settings = {
	host: 'http://localhost:3001',
	embedHost: 'http://localhost:3000',
	mockFullScreen: false
};

if (process.env.NODE_ENV !== 'development') {
	settings.mockFullScreen = false;
	settings.host = 'https://fourplayer.herokuapp.com';
	settings.embedHost = 'https://fourplayer.herokuapp.com';
}

export default settings;