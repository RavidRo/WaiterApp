import {Location, OrderStatus} from './types/ido';

export function isLocation(location: any): location is Location {
	return (
		(location as Location)?.x !== undefined &&
		(location as Location)?.y !== undefined
	);
}

export function isString(someString: any): someString is string {
	return typeof someString === 'string';
}

export function isOrderStatus(status: any): status is OrderStatus {
	const result = [
		'received',
		'in preparation',
		'ready to deliver',
		'assigned',
		'on the way',
		'canceled',
		'delivered',
	].find(availableStatus => availableStatus === status);
	return result !== undefined;
}
