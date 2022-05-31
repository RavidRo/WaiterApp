import {GPS} from '../types/map';

export type OrderStatus =
	| 'received'
	| 'in preparation'
	| 'ready to deliver'
	| 'assigned'
	| 'on the way'
	| 'delivered'
	| 'canceled';

export type OrderIDO = {
	id: OrderID;
	guestId: string;
	items: Record<string, number>;
	status: OrderStatus;
	creationTime: Date;
	terminationTime?: Date;
};
export type Location = {
	x: number;
	y: number;
	mapId: string;
};
export type Corners = {
	topRightGPS: GPS;
	topLeftGPS: GPS;
	bottomRightGPS: GPS;
	bottomLeftGPS: GPS;
};
export type ItemIDO = {
	id: string;
	name: string;
	price: double;
	preparationTime: double;
};
export type GuestIDO = {
	id: string;
	username: string;
	phoneNumber: string;
};

export type MapIDO = {
	id: string;
	name: string;
	corners: Corners;
	imageURL: string;
};
