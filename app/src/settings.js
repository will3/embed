const settings = {
	host: 'https://fourplayer.herokuapp.com',
	mockFullScreen: false
};

if (process.env.NODE_ENV !== 'development') {
	settings.mockFullScreen = false;
	settings.host = 'https://fourplayer.herokuapp.com';
}

export default settings;