import RequestsHandler from './RequestsHandler';
import {ItemIdo, OrderIdo} from '../types/ido';

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

	delivered(orderId: string): Promise<void> {
		return this.handler.post('orderArrived', {orderId});
	}
}
