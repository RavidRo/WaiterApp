import {makeAutoObservable} from 'mobx';
import {OrderStatus} from '../types/ido';
import Order from './Order';

export default class OrdersModel {
	private _orders: Map<string, Order>; //<ID, Object>
	constructor() {
		this._orders = new Map();
		makeAutoObservable(this);
	}

	get orders() {
		return Array.from(this._orders.values());
	}

	set orders(newOrders: Order[]) {
		this._orders.clear();
		newOrders.forEach(order => {
			this._orders.set(order.id, order);
		});
	}

	updateOrderStatus(orderID: string, status: OrderStatus): void {
		const order = this._orders.get(orderID);
		if (order) {
			order.orderStatus = status;
		} else {
			console.warn(
				'updateOrderStatus - Could not find requested order',
				orderID
			);
		}
	}

	removeOrder(orderID: string) {
		const existed = this._orders.delete(orderID);
		if (!existed) {
			console.warn(
				'removeOrder - Could not find requested order',
				orderID
			);
		}
	}

	addOrder(order: Order) {
		if (this._orders.has(order.id)) {
			console.warn('Assigned to a order that was already added');
		}
		this._orders.set(order.id, order);
	}
}
