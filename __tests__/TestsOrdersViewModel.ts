import {makePromise as mockMakePromise} from './PromiseUtils';
import OrderViewModel, {UIOrder} from '../src/ViewModel/OrderViewModel';
import {GuestIDO, Location, MapIDO, OrderIDO} from '../src/types/ido';

const mockListOfOrders: OrderIDO[] = [
	{
		id: '1',
		items: {a: 2, b: 3},
		status: 'assigned',
		guestID: '1',
		creationTime: new Date(),
		terminationTime: new Date(),
	},
	{
		id: '2',
		items: {a: 2, b: 3},
		status: 'assigned',
		guestID: '2',
		creationTime: new Date(),
		terminationTime: new Date(),
	},
];

const mockGuestLocation1: Location = {
	x: -5,
	y: 5,
	mapID: '1',
};
const mockGuestLocation2: Location = {
	x: 12,
	y: 34,
	mapID: '1',
};

const mockGuestDetails1: GuestIDO = {
	id: '1',
	username: 'string1',
	phoneNumber: 'string1',
};
const mockGuestDetails2: GuestIDO = {
	id: '2',
	username: 'string2',
	phoneNumber: 'string2',
};

const loc = {latitude: 0, longitude: 0};
const mockMaps: MapIDO[] = [
	{
		corners: {
			bottomLeftGPS: loc,
			bottomRightGPS: loc,
			topLeftGPS: loc,
			topRightGPS: loc,
		},
		id: '1',
		imageURL: '',
		name: '',
	},
];

const newOrders: UIOrder[] = [
	{
		id: '1',
		guestID: '1',
		guestName: mockGuestDetails1.username,
		guestPhoneNumber: mockGuestDetails1.phoneNumber,
		items: {
			banana: 2,
			boten: 3,
		},
		guestLocation: undefined,
		status: 'assigned',
		updated: false,
	},
	{
		guestID: '2',
		guestName: mockGuestDetails2.username,
		guestPhoneNumber: mockGuestDetails2.phoneNumber,
		id: '2',
		items: {
			banana: 2,
			boten: 3,
		},
		guestLocation: undefined,
		status: 'assigned',
		updated: false,
	},
];

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
			getGuestsDetails: () =>
				Promise.resolve([mockGuestDetails1, mockGuestDetails2]),
			getMaps: () => Promise.resolve(mockMaps),
		};
	});
});

import Requests from '../src/networking/Requests';
import {ItemViewModel} from '../src/ViewModel/ItemViewModel';
import MapsViewModel from '../src/ViewModel/MapsViewModel';

const newViewModels = () => {
	const requests = new Requests();
	const itemViewModel = new ItemViewModel(requests);
	const mapsViewModel = new MapsViewModel(requests);
	const orderViewModel = new OrderViewModel(
		requests,
		itemViewModel,
		mapsViewModel
	);
	return {orderViewModel, itemViewModel, mapsViewModel};
};

beforeEach(() => {
	(Requests as unknown as jest.Mock).mockClear();
	mockGetWaiterOrders.mockClear();
});

describe('Constructor', () => {
	test('The class can be created successfully', async () => {
		const {orderViewModel: orderVewModel, itemViewModel} = newViewModels();
		await itemViewModel.syncItems();
		await orderVewModel.synchronizeOrders();
		expect(orderVewModel).toBeTruthy();
	});

	test('Looked for orders in the server', async () => {
		const {orderViewModel: orderVewModel, itemViewModel} = newViewModels();
		await itemViewModel.syncItems();
		await orderVewModel.synchronizeOrders();
		expect(mockGetWaiterOrders).toHaveBeenCalled();
	});

	test('Initializing orders to the orders in the server', async () => {
		const {orderViewModel: orderVewModel, itemViewModel} = newViewModels();
		await itemViewModel.syncItems();
		await orderVewModel.synchronizeOrders();
		expect(orderVewModel.orders).toEqual(newOrders);
	});

	test('The orders are starting with no location', async () => {
		const {orderViewModel: orderVewModel, itemViewModel} = newViewModels();
		await itemViewModel.syncItems();
		await orderVewModel.synchronizeOrders();
		expect(orderVewModel.availableOrders).toEqual([]);
	});
});

describe('UpdateLocation', () => {
	test('Getting orders with available locations', async () => {
		const {orderViewModel, itemViewModel, mapsViewModel} = newViewModels();
		await itemViewModel.syncItems();
		await orderViewModel.synchronizeOrders();
		await mapsViewModel.syncMaps();
		orderViewModel.updateGuestLocation(
			mockListOfOrders[0].guestID,
			mockGuestLocation1
		);
		expect(orderViewModel.availableOrders).toEqual([
			{
				...newOrders[0],
				guestLocation: mockGuestLocation1,
				updated: false,
			},
		]);
	});
	test('Getting the most updated location', async () => {
		const {orderViewModel, itemViewModel, mapsViewModel} = newViewModels();
		await itemViewModel.syncItems();
		await orderViewModel.synchronizeOrders();
		await mapsViewModel.syncMaps();
		orderViewModel.updateGuestLocation(
			mockListOfOrders[0].guestID,
			mockGuestLocation1
		);
		orderViewModel.updateGuestLocation(
			mockListOfOrders[1].guestID,
			mockGuestLocation1
		);
		orderViewModel.updateGuestLocation(
			mockListOfOrders[1].guestID,
			mockGuestLocation2
		);
		const expectedOrders: UIOrder[] = [
			{
				...newOrders[0],
				guestLocation: mockGuestLocation1,
			},
			{
				...newOrders[1],
				guestLocation: mockGuestLocation2,
			},
		];
		expect(orderViewModel.availableOrders).toEqual(expectedOrders);
	});
});
