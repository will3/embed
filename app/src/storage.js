import storage from 'local-storage-fallback';

export default {
	get(key) {
		try {
			return JSON.parse(storage.getItem(key));
		} catch(err) {
			return null;
		}
	},
	
	set(key, value) {
		storage.setItem(key, JSON.stringify(value));
	}
}