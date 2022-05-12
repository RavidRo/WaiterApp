import RequestsHandler from './RequestsHandler';
import {GuestIDO, ItemIdo, OrderIdo} from '../types/ido';

export default class Requests {
	private handler: RequestsHandler;
	constructor() {
		this.handler = new RequestsHandler();
	}

	getWaiterOrders(): Promise<OrderIdo[]> {
		return this.handler.get('getWaiterOrders');
	}

	login(password: string): Promise<string> {
		return this.handler.post('login', {password});
	}

	getItems(): Promise<ItemIdo[]> {
		return this.handler.get('getItems');
	}

	delivered(orderID: string): Promise<void> {
		return this.handler.post('orderArrived', {orderId: orderID});
	}

	onTheWay(orderID: string): Promise<void> {
		return this.handler.post('orderOnTheWay', {orderId: orderID});
	}

	getWaiterName(): Promise<string> {
		return this.handler.get('getWaiterName');
	}

	getGuestsDetails(ids: string[]): Promise<GuestIDO[]> {
		if (ids.length === 0) {
			return Promise.resolve([]);
		}
		return this.handler.get('getGuestsDetails', {ids});
		// return this.handler.get(
		// 	'getGuestsDetails?' +
		// 		ids.map((n, index) => `ids[${index}]=${n}`).join('&')
		// );
	}
}
