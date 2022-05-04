import {makeAutoObservable} from 'mobx';
import {Location} from '../types/ido';

export default class MyLocationModel {
	private _location: Location | undefined;
	private _locationApproved: boolean;

	constructor() {
		this._locationApproved = false;
		makeAutoObservable(this);
	}

	set location(location: Location | undefined) {
		this._location = location;
	}

	get location() {
		return this._location;
	}

	get locationApproved() {
		return this._locationApproved;
	}

	approve() {
		this._locationApproved = true;
	}
}
