import storage from 'local-storage-fallback';

const prefix = '4play-';

export default {
	get(key) {
		try {
			return JSON.parse(storage.getItem(prefix + key));
		} catch(err) {
			return null;
		}
	},
	
	set(key, value) {
		storage.setItem(prefix + key, JSON.stringify(value));
	}
}