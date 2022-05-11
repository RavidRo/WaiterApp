import {GPS} from '../types/map';

export type OrderStatus =
	| 'received'
	| 'in preparation'
	| 'ready to deliver'
	| 'assigned'
	| 'on the way'
	| 'delivered'
	| 'canceled';

export type OrderIdo = {
	id: OrderID;
	guestId: string;
	items: Record<string, int>;
	status: OrderStatus;
	creationTime: Date;
	terminationTime: Date;
};
export type Location = {
	x: number;
	y: number;
};
export type Corners = {
	topRightGPS: GPS;
	topLeftGPS: GPS;
	bottomRightGPS: GPS;
	bottomLeftGPS: GPS;
};
export type ItemIdo = {
	id: string;
	name: string;
	price: double;
	preparationTime: double;
};
export type GuestIDO = {
	id: string;
	name: string;
	phoneNumber: string;
};
