import {Location} from '../src/types/ido';

const myLocation = {x: 14, y: 12};
const mockWatchLocation = jest
	.fn()
	.mockImplementation((setLocation: (location: Location) => void) => {
		setLocation(myLocation);
	});
jest.mock('../src/localization/Geolocation', () => {
	return jest.fn().mockImplementation(() => {
		return {
			watchLocation: mockWatchLocation,
		};
	});
});

const mockLocation = jest.fn();
jest.mock('../src/Models/MyLocationModel', () => {
	return jest.fn().mockImplementation(() => {
		return {
			location: mockLocation,
		};
	});
});

import MyLocationModel from '../src/Models/MyLocationModel';
import Geolocation from '../src/localization/Geolocation';
import MyLocationViewModel from '../src/ViewModel/MyLocationViewModel';
import Communicate from '../src/communication/Communicate';
import ConnectionHandler from '../src/communication/ConnectionHandler';
import Notifications from '../src/communication/Notifications';
import OrderViewModel from '../src/ViewModel/OrderViewModel';
import Requests from '../src/networking/Requests';
import {ItemViewModel} from '../src/ViewModel/ItemViewModel';

const newMyLocationViewModel = () => {
	const requests = new Requests();
	return new MyLocationViewModel(
		new Communicate(
			new ConnectionHandler(
				new Notifications(
					new OrderViewModel(requests, new ItemViewModel(requests))
				)
			)
		)
	);
};

beforeEach(() => {
	(MyLocationModel as unknown as jest.Mock).mockClear();
	(Geolocation as unknown as jest.Mock).mockClear();

	jest.useFakeTimers('legacy');
});

afterEach(() => {
	jest.clearAllTimers();
	jest.useRealTimers();
});

describe('Constructor', () => {
	it('Starting to check current location', () => {
		const myLocationViewModel = newMyLocationViewModel();
		myLocationViewModel.startTrackingLocation();
		expect(mockWatchLocation).toHaveBeenCalled();
	});

	it('Starting to update location according to changes', () => {
		const myLocationViewModel = newMyLocationViewModel();
		myLocationViewModel.startTrackingLocation();
		expect(myLocationViewModel.location).toEqual(myLocation);
	});
});
