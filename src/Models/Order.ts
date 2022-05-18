import {makeAutoObservable} from 'mobx';
import {OrderIDO, OrderStatus} from '../types/ido';

export default class Order {
	public readonly id: string;
	public readonly guestID: string;
	public readonly items: Record<string, number>;
	private _status: OrderStatus;
	private _updated: boolean;

	constructor(order: OrderIDO, updated = true) {
		makeAutoObservable(this);

		this.id = order.id;
		this.items = order.items;
		this._status = order.status;
		this.guestID = order.guestId;
		this._updated = updated;
	}

	get status() {
		return this._status;
	}

	setStatus(newStatus: OrderStatus, update: boolean) {
		if (this._status !== newStatus) {
			this._status = newStatus;
			if (update) {
				this._updated = true;
			}
		}
	}

	get updated() {
		return this._updated;
	}

	clearUpdates() {
		this._updated = false;
	}
}
