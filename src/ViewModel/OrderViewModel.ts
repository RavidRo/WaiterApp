import {Location, OrderIDO, OrderStatus} from '../types/ido';
import GuestsModel, {Guest} from '../Models/GuestsModel';
import Order from '../Models/Order';
import OrdersModel from '../Models/OrdersModel';
import Requests from '../networking/Requests';
import {ItemViewModel} from './ItemViewModel';

export type UIOrder = Order & {
	guestName?: string;
	guestPhoneNumber?: string;
	guestLocation?: Location;
};

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

			// Updating the guests
			const guestsIDs = orders.map(order => order.guestID);
			this.guestsModel.guests = guestsIDs.map(id => new Guest(id));
			this.fetchGuestsDetails(guestsIDs).catch(e => {
				console.warn("Could not fetch a gust's details", e);
			});
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

	get orders(): UIOrder[] {
		return this.ordersModel.orders.map(order => {
			const namedItems = this.nameItems(order.items);
			const guest = this.guestsModel.getGuest(order.guestID);
			return {
				...order,
				items: namedItems,
				guestLocation: guest?.location,
				guestName: guest?.name,
				guestPhoneNumber: guest?.phoneNumber,
			};
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

	public fetchGuestsDetails(guestsIDs: string[]) {
		return this.requests.getGuestsDetails(guestsIDs).then(guestsDetails => {
			this.guestsModel.updateGuestsDetails(guestsDetails);
		});
	}

	public updateGuestLocation(guestID: string, guestLocation: Location): void {
		this.guestsModel.updateGuestLocation(guestID, guestLocation);
	}

	public updateOrderStatus(orderID: string, status: OrderStatus): void {
		this.ordersModel.updateOrderStatus(orderID, status);
	}

	public deliver(orderID: string) {
		return this.requests.delivered(orderID);
	}

	public onTheWay(orderID: string) {
		return this.requests.onTheWay(orderID).then(() => {
			this.ordersModel.updateOrderStatus(orderID, 'on the way');
		});
	}

	public dismissOrder(orderID: string) {
		this.ordersModel.removeOrder(orderID);
	}

	public assignedToOrder(order: OrderIDO) {
		this.ordersModel.addOrder(new Order(order));
		this.fetchGuestsDetails([order.guestId]).catch(e => {
			console.warn("Could not fetch a gust's details", e);
		});
	}
}
