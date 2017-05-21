import uuid from 'uuid/v1';
import storage from './storage';

const mixpanel = window.mixpanel;

const userId = () => {
	if (storage.get('userId') == null) {
		storage.set('userId', uuid());
	}
	return storage.get('userId');
};

const mixpanelWrapper = {
	init(token) {
		mixpanel.init(token);
	},
	identify() {
		mixpanel.identify(userId());
	},
	track(event, properties) {
		mixpanel.track(event, properties);
	},
	get people() {
		return mixpanel.people;
	}
};

export default mixpanelWrapper;