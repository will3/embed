import lscache from 'ls-cache';
import uuid from 'uuid/v1';

export default {
	get(key) {
		return lscache.get(key);
	},
	
	set(key, value, time) {
		lscache.set(key, value, time);
	},

	get favs() {
		const add = (key, result) => {
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

		const getAll = () => {
			return this.get('fav') || {};
		}

		return {
			add, remove, has, getAll
		}
	},

	get userId() {
		if (this.get('userId') == null) {
			this.set('userId', uuid());
		}
		return this.get('userId');
	}
}