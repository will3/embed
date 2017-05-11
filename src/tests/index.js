import embed from '../index';

describe('embed', () => {
	it('youku', (done) => {
		const link = 'http://v.youku.com/v_show/id_XMjcyMTA3MjM5Ng';
		embed(link)
		.then((result) => {
			console.log(result);
			done();
		})
	});
});
