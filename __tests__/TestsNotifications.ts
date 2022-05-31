import Notifications from '../src/communication/Notifications';
import Requests from '../src/networking/Requests';
import {ItemViewModel} from '../src/ViewModel/ItemViewModel';

const mockUpdateGuestLocation = jest.fn();
const mockUpdateOrderStatus = jest.fn();

jest.mock('../src/ViewModel/OrderViewModel', () => {
	return jest.fn().mockImplementation(() => {
		return {
			updateGuestLocation: mockUpdateGuestLocation,
			updateOrderStatus: mockUpdateOrderStatus,
			synchronizeOrders: () => {},
			availableOrders: [],
			guests: [],
			orders: [],
		};
	});
});

import OrderViewModel from '../src/ViewModel/OrderViewModel';

const newNotifications = () => {
	const requests = new Requests();
	return new Notifications(
		new OrderViewModel(requests, new ItemViewModel(requests))
	);
};

beforeEach(() => {
	(OrderViewModel as unknown as jest.Mock).mockClear();
	mockUpdateOrderStatus.mockClear();
	mockUpdateGuestLocation.mockClear();
	jest.spyOn(console, 'warn').mockImplementation(jest.fn());
});

describe('updateGuestLocation', () => {
	it('Sending no arguments', () => {
		const notifications = newNotifications();
		notifications.eventToCallback.updateGuestLocation({});
		expect(mockUpdateGuestLocation).toBeCalledTimes(0);
	});

	it('Sending less arguments than required', () => {
		const notifications = newNotifications();
		notifications.eventToCallback.updateGuestLocation({
			guestId: 'HEY AVIV',
		});
		expect(mockUpdateGuestLocation).toBeCalledTimes(0);
	});

	it('Sending exactly the needed arguments', () => {
		const notifications = newNotifications();
		notifications.eventToCallback.updateGuestLocation({
			guestID: 'Hey Aviv',
			location: {x: 15, y: -26, mapId: ''},
		});
		expect(mockUpdateGuestLocation).toBeCalledTimes(1);
	});

	it('Sending extra argument is accepted', () => {
		const notifications = newNotifications();
		notifications.eventToCallback.updateGuestLocation({
			guestID: 'Hey Aviv',
			location: {x: 15, y: -26, mapId: ''},
			random: 'WEEE',
		});
		expect(mockUpdateGuestLocation).toBeCalledTimes(1);
	});

	it('Sending something else then string as guest id', () => {
		const notifications = newNotifications();
		notifications.eventToCallback.updateGuestLocation({
			guestID: 2,
			location: {x: 15, y: -26, mapId: ''},
		});
		notifications.eventToCallback.updateGuestLocation({
			guestID: ['Hey Aviv'],
			location: {x: 15, y: -26, mapId: ''},
		});
		expect(mockUpdateGuestLocation).toBeCalledTimes(0);
	});

	it('Sending something else then location as guest location', () => {
		const notifications = newNotifications();
		[{z: 15, y: -26}, {x: 15}, {}, 2, '123'].forEach(location =>
			notifications.eventToCallback.updateGuestLocation({
				guestID: 'Hey Aviv',
				location: location,
			})
		);
		expect(mockUpdateGuestLocation).toBeCalledTimes(0);
	});
});

describe('updateOrderStatus', () => {
	it('Sending no arguments', () => {
		const notifications = newNotifications();
		notifications.eventToCallback.changeOrderStatus({});
		expect(mockUpdateOrderStatus).toBeCalledTimes(0);
	});

	it('Sending less arguments than required', () => {
		const notifications = newNotifications();
		notifications.eventToCallback.changeOrderStatus({
			orderID: 'Hey Aviv',
		});
		expect(mockUpdateOrderStatus).toBeCalledTimes(0);
	});

	it('Sending exactly the needed arguments', () => {
		const notifications = newNotifications();
		notifications.eventToCallback.changeOrderStatus({
			orderID: 'Hey Aviv',
			orderStatus: 'assigned',
		});
		expect(mockUpdateOrderStatus).toBeCalledTimes(1);
	});

	it('Sending extra argument is accepted', () => {
		const notifications = newNotifications();
		notifications.eventToCallback.changeOrderStatus({
			orderID: 'Hey Aviv',
			orderStatus: 'assigned',
			random: 'WEE',
		});
		expect(mockUpdateOrderStatus).toBeCalledTimes(1);
	});

	it('Sending something else than string as order id', () => {
		const notifications = newNotifications();
		[{z: 15, y: -26}, {x: 15}, {}, 2, []].forEach(id =>
			notifications.eventToCallback.changeOrderStatus({
				id,
				orderStatus: 'assigned',
			})
		);
		expect(mockUpdateOrderStatus).toBeCalledTimes(0);
	});

	it('Sending something else than status as order status', () => {
		const notifications = newNotifications();
		[
			{z: 15, y: -26},
			{x: 15},
			{},
			2,
			[],
			'',
			'hey aviv<3',
			undefined,
		].forEach(status =>
			notifications.eventToCallback.changeOrderStatus({
				orderID: 'Hey Aviv',
				orderStatus: status,
			})
		);
		expect(mockUpdateOrderStatus).toBeCalledTimes(0);
	});
});
