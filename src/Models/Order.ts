import {makeAutoObservable} from 'mobx';
import {OrderIDO, OrderStatus} from '../types/ido';

export default class Order {
	public readonly id: string;
	public readonly guestID: string;
	public readonly items: Record<string, number>;
	private _status: OrderStatus;
	private _updated: boolean;

	constructor(order: OrderIDO) {
		makeAutoObservable(this);

		this.id = order.id;
		this.items = order.items;
		this._status = order.status;
		this.guestID = order.guestId;
		this._updated = true;
	}

	get status() {
		return this._status;
	}

	set status(newStatus) {
		this._status = newStatus;
		this._updated = true;
	}

	get updated() {
		return this._updated;
	}

	clearUpdates() {
		this._updated = false;
	}
}
