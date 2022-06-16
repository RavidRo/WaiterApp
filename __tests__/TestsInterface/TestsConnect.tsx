import {makeFail, makePromise as mockMakePromise} from '../PromiseUtils';
import React from 'react';

import {fireEvent, render, waitFor} from '@testing-library/react-native';

// https://stackoverflow.com/questions/59587799/how-to-resolve-animated-usenativedriver-is-not-supported-because-the-native
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('../../src/communication/ConnectionHandler', () => {
	return jest.fn().mockImplementation(() => {
		return {
			connect: jest
				.fn()
				.mockImplementation((_token, onSuccess, _onError) => {
					setTimeout(() => {
						onSuccess();
					}, 500);
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

import ConnectController from '../../src/components/Controllers/ConnectController';
import ConnectionModel from '../../src/Models/ConnectionModel';
import {Text} from 'react-native';

const mockedRequests = {
	login: jest.spyOn(Requests.prototype, 'login'),
	items: jest.spyOn(Requests.prototype, 'getItems'),
	orders: jest.spyOn(Requests.prototype, 'getWaiterOrders'),
	name: jest.spyOn(Requests.prototype, 'getWaiterName'),
	maps: jest.spyOn(Requests.prototype, 'getMaps'),
};
function mockDefaultImplementation() {
	mockedRequests.login.mockImplementation(() => mockMakePromise('token'));
	mockedRequests.items.mockImplementation(() => mockMakePromise([]));
	mockedRequests.orders.mockImplementation(() => mockMakePromise([]));
	mockedRequests.name.mockImplementation(() => mockMakePromise('Name'));
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
});

test('Loads an input and a submit button', async () => {
	const {getByTestId, queryByTestId} = render(
		<ConnectController>{() => <Text>Hello Test</Text>}</ConnectController>
	);

	expect(getByTestId('passwordInput')).toBeTruthy();
	expect(getByTestId('submit')).toBeTruthy();
	expect(queryByTestId('loading')).toBeFalsy();
});

test('Wrong password', async () => {
	mockedRequests.login.mockImplementation(() => makeFail());

	const {getByTestId, queryByTestId} = render(
		<ConnectController>{() => <Text>Hello Test</Text>}</ConnectController>
	);
	const button = getByTestId('submit');
	fireEvent.press(button);

	await waitFor(
		async () => {
			expect(queryByTestId('passwordInput')).toBeTruthy();
			expect(queryByTestId('submit')).toBeTruthy();
			expect(queryByTestId('loading')).toBeFalsy();
		},
		{timeout: 5000}
	);
});

test('Shows a loading indicator before results are fetched', async () => {
	const {getByTestId, queryByTestId} = render(
		<ConnectController>{() => <Text>Hello Test</Text>}</ConnectController>
	);

	const button = getByTestId('submit');
	fireEvent.press(button);

	await waitFor(() => expect(queryByTestId('loading')).toBeTruthy());
});

test('Shows home page after connecting successfully', async () => {
	const {getByTestId, queryByTestId} = render(
		<ConnectController>
			{() => <Text testID='homeScreen'>Hello Test</Text>}
		</ConnectController>
	);

	const button = getByTestId('submit');
	fireEvent.press(button);

	await waitFor(async () => {
		expect(queryByTestId('homeScreen')).toBeTruthy();
	});
});
