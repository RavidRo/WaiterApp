import RequestsHandler from './RequestsHandler';
import {GuestIDO, ItemIDO, MapIDO, OrderIDO} from '../types/ido';

export default class Requests {
	private handler: RequestsHandler;
	constructor() {
		this.handler = new RequestsHandler();
	}

	getWaiterOrders(): Promise<OrderIDO[]> {
		return this.handler.get('getWaiterOrders');
	}

	login(username: string, password: string): Promise<string> {
		return this.handler.post('login', {password, username});
	}

	getItems(): Promise<ItemIDO[]> {
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
	}

	getMaps(): Promise<MapIDO[]> {
		return this.handler.get('getMaps');
	}
}
