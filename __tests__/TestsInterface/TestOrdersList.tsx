import {makePromise as mockMakePromise, makeVoidPromise} from '../PromiseUtils';
import React from 'react';

import {act, fireEvent, render, within} from '@testing-library/react-native';

// https://stackoverflow.com/questions/59587799/how-to-resolve-animated-usenativedriver-is-not-supported-because-the-native
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('../../src/communication/ConnectionHandler', () => {
	return jest.fn().mockImplementation(() => {
		return {
			connect: jest
				.fn()
				.mockImplementation((_token, onSuccess, _onError) => {
					onSuccess();
				}),
		};
	});
});

jest.mock('../../src/localization/GeolocationAdapter', () =>
	jest.fn().mockImplementation(() => {
		return {
			watchLocation: jest.fn(),
			stopWatching: jest.fn(),
			getLocation: jest.fn(),
		};
	})
);

import GeolocationAdapter from '../../src/localization/GeolocationAdapter';
import Requests from '../../src/networking/Requests';
import ConnectionHandler from '../../src/communication/ConnectionHandler';

import ConnectionModel from '../../src/Models/ConnectionModel';
import App from '../../App';
import {ItemIDO, OrderIDO} from '../../src/types/ido';
import {__test__} from '../../src/contexts';

const mockedRequests = {
	login: jest.spyOn(Requests.prototype, 'login'),
	items: jest.spyOn(Requests.prototype, 'getItems'),
	orders: jest.spyOn(Requests.prototype, 'getWaiterOrders'),
	name: jest.spyOn(Requests.prototype, 'getWaiterName'),
	delivered: jest.spyOn(Requests.prototype, 'orderArrived'),
	onTheWay: jest.spyOn(Requests.prototype, 'orderOnTheWay'),
	guests: jest.spyOn(Requests.prototype, 'getGuestsDetails'),
	maps: jest.spyOn(Requests.prototype, 'getMaps'),
};

function mockDefaultImplementation() {
	mockedRequests.login.mockImplementation(() => mockMakePromise('token'));
	mockedRequests.items.mockImplementation(() => mockMakePromise([]));
	mockedRequests.orders.mockImplementation(() => mockMakePromise([]));
	mockedRequests.name.mockImplementation(() => mockMakePromise('Name'));
	mockedRequests.delivered.mockImplementation(() => makeVoidPromise());
	mockedRequests.onTheWay.mockImplementation(() => makeVoidPromise());
	mockedRequests.guests.mockImplementation(() => mockMakePromise([]));
	mockedRequests.maps.mockImplementation(() => mockMakePromise([]));
}

jest.setTimeout(10000);

beforeEach(() => {
	(GeolocationAdapter as unknown as jest.Mock).mockClear();
	(ConnectionHandler as unknown as jest.Mock).mockClear();

	ConnectionModel.getInstance().isReconnecting = false;
	ConnectionModel.getInstance().token = undefined;

	mockDefaultImplementation();

	jest.spyOn(console, 'info').mockImplementation(jest.fn());
	jest.spyOn(console, 'warn').mockImplementation(jest.fn());
});

test('Loads successfully the home page', async () => {
	const {getByTestId, findByTestId} = render(<App />);

	const submitButton = getByTestId('submit');
	fireEvent.press(submitButton);

	const homeScreen = await findByTestId('homeScreen');
	expect(homeScreen).toBeTruthy();
});

test('A button for the orders list exists on the home page', async () => {
	const {getByTestId, findByTestId} = render(<App />);

	const submitButton = getByTestId('submit');
	fireEvent.press(submitButton);

	const ordersListButton = await findByTestId('ordersListButton');
	expect(ordersListButton).toBeTruthy();
});

test('Pressing the orders list buttons opens a list of orders', async () => {
	const {getByTestId, findByTestId} = render(<App />);

	const submitButton = getByTestId('submit');
	fireEvent.press(submitButton);

	const ordersListButton = await findByTestId('ordersListButton');
	fireEvent.press(ordersListButton);

	const ordersList = await findByTestId('ordersList');
	expect(ordersList).toBeTruthy();
});

test('Show 0 order when there is no order to show', async () => {
	const {getByTestId, findByTestId, queryAllByTestId} = render(<App />);

	const submitButton = getByTestId('submit');
	fireEvent.press(submitButton);

	const ordersListButton = await findByTestId('ordersListButton');

	fireEvent.press(ordersListButton);

	const orderItems = queryAllByTestId('orderItem');
	expect(orderItems).toHaveLength(0);
});

test('Show orders when received orders from server', async () => {
	const orders: OrderIDO[] = [
		{
			creationTime: new Date(),
			guestID: '1',
			id: '1',
			items: {},
			status: 'assigned',
		},
	];
	mockedRequests.orders.mockImplementation(() => mockMakePromise(orders));

	const {getByTestId, findByTestId, queryAllByTestId} = render(<App />);

	const submitButton = getByTestId('submit');
	fireEvent.press(submitButton);

	const ordersListButton = await findByTestId('ordersListButton');

	fireEvent.press(ordersListButton);

	const orderItems = queryAllByTestId('orderItem');
	expect(orderItems).toHaveLength(1);
});

test('Show multiple orders when received orders from server', async () => {
	const orders: OrderIDO[] = [
		{
			creationTime: new Date(),
			guestID: '1',
			id: '1',
			items: {},
			status: 'assigned',
		},
		{
			creationTime: new Date(),
			guestID: '1',
			id: '2',
			items: {},
			status: 'assigned',
		},
	];
	mockedRequests.orders.mockImplementation(() => mockMakePromise(orders));

	const {getByTestId, findByTestId, queryAllByTestId} = render(<App />);

	const submitButton = getByTestId('submit');
	fireEvent.press(submitButton);

	const ordersListButton = await findByTestId('ordersListButton');

	fireEvent.press(ordersListButton);

	const orderItems = queryAllByTestId('orderItem');
	expect(orderItems).toHaveLength(2);
});

test('Shows the orders correct statuses', async () => {
	const orders: OrderIDO[] = [
		{
			creationTime: new Date(),
			guestID: '1',
			id: '1',
			items: {},
			status: 'assigned',
		},
		{
			creationTime: new Date(),
			guestID: '1',
			id: '2',
			items: {},
			status: 'on the way',
		},
	];
	mockedRequests.orders.mockImplementation(() => mockMakePromise(orders));

	const {getByTestId, findByTestId} = render(<App />);

	const submitButton = getByTestId('submit');
	fireEvent.press(submitButton);

	const ordersListButton = await findByTestId('ordersListButton');
	fireEvent.press(ordersListButton);

	const ordersList = await findByTestId('ordersList');

	const orderItemsAssigned = within(ordersList).queryAllByText('assigned', {
		exact: false,
	});
	const orderItemsOnTheWay = within(ordersList).getAllByText('on the way', {
		exact: false,
	});
	expect(orderItemsAssigned).toHaveLength(1);
	expect(orderItemsOnTheWay).toHaveLength(1);
});

test('Items does not show before opening item', async () => {
	const orders: OrderIDO[] = [
		{
			creationTime: new Date(),
			guestID: '1',
			id: '1',
			items: {'1': 5, '3': 10},
			status: 'assigned',
		},
		{
			creationTime: new Date(),
			guestID: '1',
			id: '2',
			items: {'2': 5},
			status: 'on the way',
		},
	];
	const items: ItemIDO[] = [
		{id: '1', name: 'banana1', preparationTime: 0, price: 0},
		{id: '2', name: 'banana2', preparationTime: 0, price: 0},
		{id: '3', name: 'banana3', preparationTime: 0, price: 0},
	];
	mockedRequests.orders.mockImplementation(() => mockMakePromise(orders));
	mockedRequests.items.mockImplementation(() => mockMakePromise(items));

	const {getByTestId, findByTestId} = render(<App />);

	const submitButton = getByTestId('submit');
	fireEvent.press(submitButton);

	const ordersListButton = await findByTestId('ordersListButton');
	fireEvent.press(ordersListButton);

	const ordersList = await findByTestId('ordersList');

	const banana1 = within(ordersList).queryAllByText('banana1', {
		exact: false,
	});
	const banana2 = within(ordersList).queryAllByText('banana2', {
		exact: false,
	});
	const banana3 = within(ordersList).queryAllByText('banana3', {
		exact: false,
	});
	expect(banana1).toHaveLength(0);
	expect(banana2).toHaveLength(0);
	expect(banana3).toHaveLength(0);
});

test('Shows the orders correct items', async () => {
	const orders: OrderIDO[] = [
		{
			creationTime: new Date(),
			guestID: '1',
			id: '1',
			items: {'1': 5, '3': 10},
			status: 'assigned',
		},
		{
			creationTime: new Date(),
			guestID: '1',
			id: '2',
			items: {'2': 5},
			status: 'on the way',
		},
	];
	const items: ItemIDO[] = [
		{id: '1', name: 'banana1', preparationTime: 0, price: 0},
		{id: '2', name: 'banana2', preparationTime: 0, price: 0},
		{id: '3', name: 'banana3', preparationTime: 0, price: 0},
	];
	mockedRequests.orders.mockImplementation(() => mockMakePromise(orders));
	mockedRequests.items.mockImplementation(() => mockMakePromise(items));

	const {getByTestId, findByTestId, queryAllByTestId} = render(<App />);

	const submitButton = getByTestId('submit');
	fireEvent.press(submitButton);

	const ordersListButton = await findByTestId('ordersListButton');
	fireEvent.press(ordersListButton);

	const ordersList = await findByTestId('ordersList');

	const orderItems = queryAllByTestId('orderItem');
	orderItems.forEach(item => {
		fireEvent.press(item);
	});

	const banana1 = await within(ordersList).findAllByText('banana1', {
		exact: false,
	});
	const banana2 = await within(ordersList).findAllByText('banana2', {
		exact: false,
	});
	const banana3 = await within(ordersList).findAllByText('banana3', {
		exact: false,
	});
	expect(banana1).toHaveLength(1);
	expect(banana2).toHaveLength(1);
	expect(banana3).toHaveLength(1);
});

test('Shows the orders correct items quantities', async () => {
	const orders: OrderIDO[] = [
		{
			creationTime: new Date(),
			guestID: '1',
			id: '1',
			items: {'1': 13, '3': 17},
			status: 'assigned',
		},
		{
			creationTime: new Date(),
			guestID: '1',
			id: '2',
			items: {'2': 23},
			status: 'on the way',
		},
	];
	const items: ItemIDO[] = [
		{id: '1', name: 'banana1', preparationTime: 0, price: 0},
		{id: '2', name: 'banana2', preparationTime: 0, price: 0},
		{id: '3', name: 'banana3', preparationTime: 0, price: 0},
	];
	mockedRequests.orders.mockImplementation(() => mockMakePromise(orders));
	mockedRequests.items.mockImplementation(() => mockMakePromise(items));

	const {getByTestId, findByTestId, queryAllByTestId} = render(<App />);

	const submitButton = getByTestId('submit');
	fireEvent.press(submitButton);

	const ordersListButton = await findByTestId('ordersListButton');
	fireEvent.press(ordersListButton);

	const ordersList = await findByTestId('ordersList');

	const orderItems = queryAllByTestId('orderItem');
	orderItems.forEach(item => {
		fireEvent.press(item);
	});

	const banana1 = await within(ordersList).findAllByText('13', {
		exact: false,
	});
	const banana2 = await within(ordersList).findAllByText('17', {
		exact: false,
	});
	const banana3 = await within(ordersList).findAllByText('23', {
		exact: false,
	});
	expect(banana1).toHaveLength(1);
	expect(banana2).toHaveLength(1);
	expect(banana3).toHaveLength(1);
});

test("Orders' statuses changed when notifications are received", async () => {
	const orders: OrderIDO[] = [
		{
			creationTime: new Date(),
			guestID: '1',
			id: '1',
			items: {},
			status: 'assigned',
		},
		{
			creationTime: new Date(),
			guestID: '1',
			id: '2',
			items: {},
			status: 'on the way',
		},
	];
	mockedRequests.orders.mockImplementation(() => mockMakePromise(orders));

	const {getByTestId, findByTestId} = render(<App />);

	const submitButton = getByTestId('submit');
	fireEvent.press(submitButton);

	const ordersListButton = await findByTestId('ordersListButton');
	fireEvent.press(ordersListButton);

	const ordersList = await findByTestId('ordersList');

	act(() => {
		__test__.notifications.eventToCallback.changeOrderStatus({
			orderID: '2',
			orderStatus: 'delivered',
		});
	});

	const orderItemsAssigned = within(ordersList).queryAllByText('assigned', {
		exact: false,
	});
	const orderItemsOnTheWay = within(ordersList).getAllByText('delivered', {
		exact: false,
	});

	expect(orderItemsAssigned).toHaveLength(1);
	expect(orderItemsOnTheWay).toHaveLength(1);
});

test('Dismiss button appear when status is changed to delivered', async () => {
	const orders: OrderIDO[] = [
		{
			creationTime: new Date(),
			guestID: '1',
			id: '1',
			items: {},
			status: 'assigned',
		},
		{
			creationTime: new Date(),
			guestID: '1',
			id: '2',
			items: {},
			status: 'on the way',
		},
	];
	mockedRequests.orders.mockImplementation(() => mockMakePromise(orders));

	const {getByTestId, findByTestId, queryAllByTestId} = render(<App />);

	const submitButton = getByTestId('submit');
	fireEvent.press(submitButton);

	const ordersListButton = await findByTestId('ordersListButton');
	fireEvent.press(ordersListButton);

	const ordersList = await findByTestId('ordersList');

	act(() => {
		__test__.notifications.eventToCallback.changeOrderStatus({
			orderID: '2',
			orderStatus: 'delivered',
		});
	});

	const orderItems = queryAllByTestId('orderItem');
	orderItems.forEach(item => {
		fireEvent.press(item);
	});

	const dismissButtons = await within(ordersList).findAllByTestId(
		'dismissButton'
	);

	expect(dismissButtons).toHaveLength(1);
});

test('Dismiss button appear when status is changed to canceled', async () => {
	const orders: OrderIDO[] = [
		{
			creationTime: new Date(),
			guestID: '1',
			id: '1',
			items: {},
			status: 'assigned',
		},
		{
			creationTime: new Date(),
			guestID: '1',
			id: '2',
			items: {},
			status: 'on the way',
		},
	];
	mockedRequests.orders.mockImplementation(() => mockMakePromise(orders));

	const {getByTestId, findByTestId, queryAllByTestId} = render(<App />);

	const submitButton = getByTestId('submit');
	fireEvent.press(submitButton);

	const ordersListButton = await findByTestId('ordersListButton');
	fireEvent.press(ordersListButton);

	const ordersList = await findByTestId('ordersList');

	act(() => {
		__test__.notifications.eventToCallback.changeOrderStatus({
			orderID: '2',
			orderStatus: 'canceled',
		});
	});

	const orderItems = queryAllByTestId('orderItem');
	orderItems.forEach(item => {
		fireEvent.press(item);
	});

	const dismissButtons = await within(ordersList).findAllByTestId(
		'dismissButton'
	);

	expect(dismissButtons).toHaveLength(1);
});

test('Dismiss button appear when status is changed to in preparation', async () => {
	const orders: OrderIDO[] = [
		{
			creationTime: new Date(),
			guestID: '1',
			id: '1',
			items: {},
			status: 'assigned',
		},
		{
			creationTime: new Date(),
			guestID: '1',
			id: '2',
			items: {},
			status: 'on the way',
		},
	];
	mockedRequests.orders.mockImplementation(() => mockMakePromise(orders));

	const {getByTestId, findByTestId, queryAllByTestId} = render(<App />);

	const submitButton = getByTestId('submit');
	fireEvent.press(submitButton);

	const ordersListButton = await findByTestId('ordersListButton');
	fireEvent.press(ordersListButton);

	const ordersList = await findByTestId('ordersList');

	act(() => {
		__test__.notifications.eventToCallback.changeOrderStatus({
			orderID: '2',
			orderStatus: 'in preparation',
		});
	});

	const orderItems = queryAllByTestId('orderItem');
	orderItems.forEach(item => {
		fireEvent.press(item);
	});

	const dismissButtons = await within(ordersList).findAllByTestId(
		'dismissButton'
	);

	expect(dismissButtons).toHaveLength(1);
});

test('Dismiss buttons appears only inside the expanded item', async () => {
	const orders: OrderIDO[] = [
		{
			creationTime: new Date(),
			guestID: '1',
			id: '1',
			items: {},
			status: 'assigned',
		},
		{
			creationTime: new Date(),
			guestID: '1',
			id: '2',
			items: {},
			status: 'on the way',
		},
	];
	mockedRequests.orders.mockImplementation(() => mockMakePromise(orders));

	const {getByTestId, findByTestId} = render(<App />);

	const submitButton = getByTestId('submit');
	fireEvent.press(submitButton);

	const ordersListButton = await findByTestId('ordersListButton');
	fireEvent.press(ordersListButton);

	const ordersList = await findByTestId('ordersList');

	act(() => {
		__test__.notifications.eventToCallback.changeOrderStatus({
			orderID: '2',
			orderStatus: 'delivered',
		});
	});

	const dismissButtons = await within(ordersList).queryAllByTestId(
		'dismissButton'
	);

	expect(dismissButtons).toHaveLength(0);
});

test('Dismissing an order removes it completely from the orders list', async () => {
	const orders: OrderIDO[] = [
		{
			creationTime: new Date(),
			guestID: '1',
			id: '1',
			items: {},
			status: 'assigned',
		},
		{
			creationTime: new Date(),
			guestID: '1',
			id: '2',
			items: {},
			status: 'on the way',
		},
	];
	mockedRequests.orders.mockImplementation(() => mockMakePromise(orders));

	const {getByTestId, findByTestId, queryAllByTestId, findAllByTestId} =
		render(<App />);

	const submitButton = getByTestId('submit');
	fireEvent.press(submitButton);

	const ordersListButton = await findByTestId('ordersListButton');
	fireEvent.press(ordersListButton);

	const ordersList = await findByTestId('ordersList');

	act(() => {
		__test__.notifications.eventToCallback.changeOrderStatus({
			orderID: '2',
			orderStatus: 'delivered',
		});
	});

	const orderItems = queryAllByTestId('orderItem');

	expect(orderItems).toHaveLength(2);

	orderItems.forEach(item => {
		fireEvent.press(item);
	});

	const dismissButtons = await within(ordersList).findAllByTestId(
		'dismissButton'
	);

	fireEvent.press(dismissButtons[0]);

	const orderItemsAfterDismiss = await findAllByTestId('orderItem');

	expect(orderItemsAfterDismiss).toHaveLength(1);
});

test('A new order appear when a notification received', async () => {
	const orders: OrderIDO[] = [
		{
			creationTime: new Date(),
			guestID: '1',
			id: '1',
			items: {},
			status: 'assigned',
		},
		{
			creationTime: new Date(),
			guestID: '1',
			id: '2',
			items: {},
			status: 'on the way',
		},
	];
	mockedRequests.orders.mockImplementation(() => mockMakePromise(orders));

	const {getByTestId, findByTestId, queryAllByTestId} = render(<App />);

	const submitButton = getByTestId('submit');
	fireEvent.press(submitButton);

	const ordersListButton = await findByTestId('ordersListButton');
	fireEvent.press(ordersListButton);

	act(() => {
		const order: OrderIDO = {
			id: '3',
			creationTime: new Date(),
			guestID: '1',
			items: {},
			status: 'assigned',
		};
		__test__.notifications.eventToCallback.assignedToOrder({order});
	});

	const orderItems = queryAllByTestId('orderItem');

	expect(orderItems).toHaveLength(3);
});
