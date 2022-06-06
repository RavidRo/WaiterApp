import {makeAutoObservable} from 'mobx';
import {GuestIDO, Location} from '../types/ido';

export default class GuestsModel {
	private _guests: Map<string, Guest>; //<ID, Object>
	constructor() {
		this._guests = new Map();
		makeAutoObservable(this);
	}

	get guests(): Guest[] {
		return Array.from(this._guests.values());
	}

	set guests(newGuests: Guest[]) {
		this._guests.clear();
		newGuests.forEach(guest => {
			this._guests.set(guest.id, guest);
		});
	}

	getGuest(guestID: string): Guest | undefined {
		return this._guests.get(guestID);
	}

	updateGuestLocation(guestID: string, location: Location): void {
		const guest = this._guests.get(guestID);
		if (guest) {
			guest.location = location;
		}
	}

	updateGuestsDetails(guestsDetails: GuestIDO[]) {
		guestsDetails.forEach(guest => {
			if (!this._guests.has(guest.id)) {
				this._guests.set(guest.id, new Guest(guest.id));
			}
			const guestObject = this._guests.get(guest.id)!;
			guestObject.name = guest.username;
			guestObject.phoneNumber = guest.phoneNumber;
		});
	}

	setError(guestID: string, errorMsg: string) {
		if (!this._guests.has(guestID)) {
			this._guests.set(guestID, new Guest(guestID));
		}
		const guestObject = this._guests.get(guestID)!;
		guestObject.error = errorMsg;
	}
}

export class Guest {
	public readonly id: string;
	public name?: string;
	public phoneNumber?: string;
	public location?: Location;
	private _error?: string;

	constructor(id: string) {
		this.id = id;
		makeAutoObservable(this);
	}

	get error() {
		return this._error;
	}

	set error(errorMsg: string | undefined) {
		this._error = errorMsg;
	}
}
