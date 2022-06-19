import {
	ItemIDO,
	MapIDO,
	OrderIDO,
	GuestIDO,
	Location,
	OrderStatus,
} from './ido';

export interface WaiterAPI {
	login: (username: string, password: string) => Promise<string>;
	getItems: () => Promise<ItemIDO[]>;
	getMaps: () => Promise<MapIDO[]>;
	getWaiterOrders: () => Promise<OrderIDO[]>;
	getGuestsDetails: (ids: string[]) => Promise<GuestIDO[]>;
	orderArrived: (orderID: string) => Promise<void>;
	orderOnTheWay: (orderID: string) => Promise<void>;
}
export interface WaiterCommunication {
	updateWaiterLocation: (waiterLocation: Location) => void;
	locationErrorWaiter: (errorMsg: string) => void;
}
export interface WaiterNotificationHandler {
	updateGuestLocation(guestID: string, guestLocation: Location): void;
	changeOrderStatus(orderID: string, status: OrderStatus): void;
	assignedToOrder(order: OrderIDO): void;
}
