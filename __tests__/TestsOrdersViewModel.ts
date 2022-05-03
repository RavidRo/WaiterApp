import {flushPromises, makePromise as mockMakePromise} from './PromiseUtils';
import OrderViewModel from '../src/ViewModel/OrderViewModel';
import {ItemIdo, OrderIdo} from '../src/types/ido';
import Order from '../src/Models/Order';

const mockListOfOrders: OrderIdo[] = [
	{
		id: '1',
		items: {a: 2, b: 3},
		status: 'inprogress',
		guestID: '1',
		creationTime: new Date(),
		terminationTime: new Date(),
	},
	{
		id: '2',
		items: {a: 2, b: 3},
		status: 'completed',
		guestID: '2',
		creationTime: new Date(),
		terminationTime: new Date(),
	},
];
const newOrders = [
	{
		guestID: '1',
		id: '1',
		items: {
			banana: 2,
			boten: 3,
		},
		orderStatus: 'inprogress',
	},
	{
		guestID: '2',
		id: '2',
		items: {
			banana: 2,
			boten: 3,
		},
		orderStatus: 'completed',
	},
];
const mockGuestLocation1 = {
	x: -5,
	y: 5,
};
const mockGuestLocation2 = {
	x: 12,
	y: 34,
};

const mockGetWaiterOrders = jest.fn(() => mockMakePromise(mockListOfOrders));

jest.mock('../src/networking/Requests', () => {
	return jest.fn().mockImplementation(() => {
		return {
			getWaiterOrders: mockGetWaiterOrders,
			getItems: () =>
				mockMakePromise([
					{id: 'a', name: 'banana', preparationTime: 0, price: 0},
					{id: 'b', name: 'boten', preparationTime: 0, price: 0},
				]),
			orderArrived: () => {},
			login: () => mockMakePromise('id'),
		};
	});
});

import Requests from '../src/networking/Requests';
import {ItemViewModel} from '../src/ViewModel/ItemViewModel';

const newViewModels = () => {
	const requests = new Requests();
	const itemViewModel = new ItemViewModel(requests);
	const orderViewModel = new OrderViewModel(requests, itemViewModel);
	return {orderVewModel: orderViewModel, itemViewModel};
};

beforeEach(() => {
	(Requests as unknown as jest.Mock).mockClear();
	mockGetWaiterOrders.mockClear();
});

describe('Constructor', () => {
	test('The class can be created successfully', async () => {
		const {orderVewModel, itemViewModel} = newViewModels();
		await itemViewModel.syncItems();
		await orderVewModel.synchronizeOrders();
		expect(orderVewModel).toBeTruthy();
	});

	test('Looked for orders in the server', async () => {
		const {orderVewModel, itemViewModel} = newViewModels();
		await itemViewModel.syncItems();
		await orderVewModel.synchronizeOrders();
		expect(mockGetWaiterOrders).toHaveBeenCalled();
	});

	test('Initializing orders to the orders in the server', async () => {
		const {orderVewModel, itemViewModel} = newViewModels();
		await itemViewModel.syncItems();
		await orderVewModel.synchronizeOrders();
		expect(orderVewModel.orders).toEqual(newOrders);
	});

	test('The orders are starting with no location', async () => {
		const {orderVewModel, itemViewModel} = newViewModels();
		await itemViewModel.syncItems();
		await orderVewModel.synchronizeOrders();
		expect(orderVewModel.availableOrders).toEqual([]);
	});
});

describe('UpdateLocation', () => {
	test('Getting orders with available locations', async () => {
		const {orderVewModel, itemViewModel} = newViewModels();
		await itemViewModel.syncItems();
		await orderVewModel.synchronizeOrders();
		orderVewModel.updateGuestLocation(
			mockListOfOrders[0].guestID,
			mockGuestLocation1
		);
		expect(orderVewModel.availableOrders).toEqual([
			{
				order: newOrders[0],
				location: mockGuestLocation1,
			},
		]);
	});
	test('Getting the most updated location', async () => {
		const {orderVewModel, itemViewModel} = newViewModels();
		await itemViewModel.syncItems();
		await orderVewModel.synchronizeOrders();
		orderVewModel.updateGuestLocation(
			mockListOfOrders[0].guestID,
			mockGuestLocation1
		);
		orderVewModel.updateGuestLocation(
			mockListOfOrders[1].guestID,
			mockGuestLocation1
		);
		orderVewModel.updateGuestLocation(
			mockListOfOrders[1].guestID,
			mockGuestLocation2
		);
		expect(orderVewModel.availableOrders).toEqual([
			{
				order: newOrders[0],
				location: mockGuestLocation1,
			},
			{
				order: newOrders[1],
				location: mockGuestLocation2,
			},
		]);
	});
});
