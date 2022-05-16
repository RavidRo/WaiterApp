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
		return Promise.resolve([
			{
				corners: {
					bottomRightGPS: {longitude: 34.802516, latitude: 31.261649},
					bottomLeftGPS: {longitude: 34.800838, latitude: 31.261649},
					topRightGPS: {longitude: 34.802516, latitude: 31.26355},
					topLeftGPS: {longitude: 34.800838, latitude: 31.26355},
				},
				id: 'Random Map ID',
				imageURL:
					'https://res.cloudinary.com/noa-health/image/upload/v1640287601/bengurion-map_q32yck.png',
				name: 'Beit Ha Student',
			},
		]);
	}
}
