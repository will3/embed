const validateResult = (err, result) => {
	if (err) {
		throw err;
	}

	if (result.videos.length === 0)	 {
		throw new Error('no way to embed ' + result.url);
	}
}

module.exports = validateResult;