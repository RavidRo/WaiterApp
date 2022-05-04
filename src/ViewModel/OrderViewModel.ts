import {Location, OrderStatus} from '../types/ido';
import GuestsModel, {Guest} from '../Models/GuestsModel';
import Order from '../Models/Order';
import OrdersModel from '../Models/OrdersModel';
import Requests from '../networking/Requests';
import {ItemViewModel} from './ItemViewModel';

export default class OrderViewModel {
	private requests: Requests;
	private ordersModel: OrdersModel;
	private guestsModel: GuestsModel;
	private itemViewModel: ItemViewModel;

	constructor(requests: Requests, itemViewModel: ItemViewModel) {
		this.requests = requests;
		this.ordersModel = new OrdersModel();
		this.guestsModel = new GuestsModel();
		this.itemViewModel = itemViewModel;
	}

	public synchronizeOrders(): Promise<void> {
		return this.requests.getWaiterOrders().then(newOrders => {
			const orders = newOrders.map(order => new Order(order));
			this.ordersModel.orders = orders;
			this.guestsModel.guests = orders.map(
				order => new Guest(order.guestID)
			);
		});
	}

	private nameItems(items: Record<string, number>) {
		const rawItems = Object.entries(items);
		const allNamedItems: [string | undefined, number][] = rawItems.map(
			([id, quantity]) => [
				this.itemViewModel.getItemByID(id)?.name,
				quantity,
			]
		);
		if (allNamedItems.length !== rawItems.length) {
			console.warn('Could not find a name of an item id');
		}
		const namedItems = allNamedItems.filter(
			([name, _]) => name !== undefined
		) as [string, number][];
		return Object.fromEntries(namedItems);
	}

	get orders(): Order[] {
		return this.ordersModel.orders.map(order => {
			const namedItems = this.nameItems(order.items);
			return {...order, items: namedItems};
		});
	}
	get guests(): Guest[] {
		return this.guestsModel.guests;
	}

	get availableOrders(): {order: Order; location: Location}[] {
		const guests = this.guestsModel.guests;
		return this.orders
			.map(order => {
				const foundGuest = guests.find(
					guest => guest.id === order.guestID
				);
				return {order, location: foundGuest?.location};
			})
			.filter(orderLocation => orderLocation.location) as {
			order: Order;
			location: Location;
		}[];
	}

	public updateGuestLocation(guestID: string, guestLocation: Location): void {
		this.guestsModel.updateGuestLocation(guestID, guestLocation);
	}

	public updateOrderStatus(orderID: string, status: OrderStatus): void {
		this.ordersModel.updateOrderStatus(orderID, status);
	}

	public deliver(orderID: string) {
		return this.requests.delivered(orderID).then(() => {
			this.ordersModel.removeOrder(orderID);
		});
	}
}
