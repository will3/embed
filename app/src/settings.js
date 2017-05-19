const settings = {
	host: process.env.NODE_ENV == 'development' ? 'http://localhost:3001' : 'https://fourplay.herokuapp.com'
};

export default settings;