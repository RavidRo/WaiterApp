import {makeAutoObservable} from 'mobx';
import {Location} from '../types/ido';

export default class MyLocationModel {
	private _location: Location | undefined;
	private _locationApproved: boolean;
	private _locationError: string | undefined;

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

	set locationError(error: string | undefined) {
		this._locationError = error;
	}

	get locationError(): string | undefined {
		return this._locationError;
	}

	approve() {
		this._locationApproved = true;
	}
}
