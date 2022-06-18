import RequestsHandler from './RequestsHandler';
import {GuestIDO, ItemIDO, MapIDO, OrderIDO} from '../types/ido';
import {WaiterAPI} from '../types/api';

export default class Requests implements WaiterAPI {
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

	orderArrived(orderID: string): Promise<void> {
		return this.handler.post('orderArrived', {orderID: orderID});
	}

	orderOnTheWay(orderID: string): Promise<void> {
		return this.handler.post('orderOnTheWay', {orderID: orderID});
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
