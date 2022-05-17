import {makeAutoObservable} from 'mobx';
import {OrderIDO, OrderStatus} from '../types/ido';

export default class Order {
	public readonly id: string;
	public readonly guestID: string;
	public readonly items: Record<string, number>;
	public orderStatus: OrderStatus;

	constructor(order: OrderIDO) {
		makeAutoObservable(this);

		this.id = order.id;
		this.items = order.items;
		this.orderStatus = order.status;
		this.guestID = order.guestID;
	}
}
