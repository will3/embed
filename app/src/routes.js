import route from 'riot-route';
import URL from 'url-parse';
import container from './container';

const start = () => {
	route('e/*', function(id) {
	  container.app.loadEmbed(id);
	});

	route('s...', () => {
		const query = route.query();
		container.app.showSearchResults(query);
	});

	route(() => {
		container.app.showEmbed();
	});

  route.start(true);
};

const add = (url) => {
  route(url);
};

export default {
  start,
  add
};