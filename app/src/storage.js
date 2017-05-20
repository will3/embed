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
	},

	get favs() {
		const add = (result) => {
			if (result.videos.length === 0) {
				return;
			}
			const key = result.videos[0].url;
			const favs = this.get('fav') || {};
			favs[key] = result;
			this.set('fav', favs);
		};

		const remove = (key) => {
			const favs = this.get('fav') || {};
			delete favs[key];
			this.set('fav', favs);
		};

		const has = (key) => {
			const favs = this.get('fav') || {};
			return favs[key] != null;
		}

		return {
			add, remove, has
		}
	}
}