const settings = {
	host: 'https://fourplay.herokuapp.com',
	mockFullScreen: false
};

if (process.env.NODE_ENV === 'development') {
	settings.host = 'http://localhost:3001';
}

if (process.env.NODE_ENV !== 'development') {
	settings.mockFullScreen = false;
}

export default settings;