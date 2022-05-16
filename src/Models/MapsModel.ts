import {makeAutoObservable} from 'mobx';
import {MapIDO} from '../types/ido';

export default class MapsModel {
	private _maps: MapIDO[];

	constructor() {
		this._maps = [];
		makeAutoObservable(this);
	}

	get maps() {
		return this._maps;
	}

	set maps(newMaps: MapIDO[]) {
		this._maps = newMaps;
	}

	get defaultMap(): MapIDO | undefined {
		if (this._maps.length > 0) {
			return this._maps[0];
		}
	}
}
