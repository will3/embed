import route from 'riot-route';
import URL from 'url-parse';
import container from './container';

route('e/*', function(id) {
  container.app.loadEmbed(id);
});

const start = () => {
  route.start(true);
};

const add = (url) => {
  route(url);
};

export default {
  start,
  add
};