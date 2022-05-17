import Geolocation from '../src/localization/Geolocation';
import {GPS} from '../src/types/map';
import {makePromise as mockMakePromise} from './PromiseUtils';

const mockStopWatching = jest.fn();
const mockGetLocation = jest.fn();
const mockWatchLocation = jest.fn();
jest.mock('../src/localization/GeolocationAdapter', () => {
	return jest.fn().mockImplementation(() => {
		return {
			watchLocation: mockWatchLocation,
			stopWatching: mockStopWatching,
			getLocation: mockGetLocation,
		};
	});
});
const mockMapID = 'Random Map ID';

jest.mock('../src/networking/Requests', () => {
	return jest.fn().mockImplementation(() => {
		return {
			getMaps: () =>
				mockMakePromise([
					{
						corners: {
							bottomLeftGPS: {
								latitude: 0,
								longitude: 0,
							},
							bottomRightGPS: {
								latitude: 0,
								longitude: 2,
							},
							topLeftGPS: {
								latitude: 2,
								longitude: 0,
							},
							topRightGPS: {
								latitude: 2,
								longitude: 2,
							},
						},
						id: mockMapID,
						imageURL:
							'https://res.cloudinary.com/noa-health/image/upload/v1640287601/bengurion-map_q32yck.png',
						name: 'Beit Ha Student',
					},
				]),
		};
	});
});

import GeolocationAdapter from '../src/localization/GeolocationAdapter';
import MapViewModel from '../src/ViewModel/MapsViewModel';
import Requests from '../src/networking/Requests';

beforeEach(() => {
	(GeolocationAdapter as unknown as jest.Mock).mockClear();
	(Requests as unknown as jest.Mock).mockClear();

	mockGetLocation.mockClear();
	mockGetLocation.mockImplementation((onSuccess: (location: GPS) => void) => {
		onSuccess({
			longitude: 0.5,
			latitude: 0.5,
		});
	});
	mockWatchLocation.mockClear();
	mockWatchLocation.mockImplementation(
		(onSuccess: (location: GPS) => void) => {
			onSuccess({
				longitude: 0.5,
				latitude: 0.5,
			});
		}
	);
	mockStopWatching.mockClear();
});

async function makeGeolocation() {
	const mapsViewModel = new MapViewModel(new Requests());
	const geolocation = new Geolocation(mapsViewModel);
	await mapsViewModel.syncMaps();
	return geolocation;
}

describe('getLocation', () => {
	it('Get location calls the on success callback', async () => {
		expect.assertions(1);
		const geolocation = await makeGeolocation();
		geolocation.getLocation(
			location => expect(location).toBeTruthy(),
			() => {}
		);
	});

	it('Get location translate the location successfully', async () => {
		expect.assertions(2);
		const geolocation = await makeGeolocation();
		geolocation.getLocation(
			location =>
				expect(location).toEqual({
					x: 0.25,
					y: 0.75,
					mapID: mockMapID,
				}),
			() => {}
		);
		mockGetLocation.mockImplementation(
			(onSuccess: (location: GPS) => void) => {
				onSuccess({
					longitude: 1,
					latitude: 1,
				});
			}
		);
		geolocation.getLocation(
			location =>
				expect(location).toEqual({
					x: 0.5,
					y: 0.5,
					mapID: mockMapID,
				}),
			() => {}
		);
	});

	it('Calls the onError call back when theres an error', async () => {
		expect.assertions(2);
		const geolocation = await makeGeolocation();
		mockGetLocation.mockImplementation((_, onError) => {
			onError('Failed1');
		});
		geolocation.getLocation(
			() => {},
			error => {
				expect(error).toBe('Failed1');
			}
		);
		mockGetLocation.mockImplementation((_, onError) => {
			onError('Failed2');
		});
		geolocation.getLocation(
			() => {},
			error => {
				expect(error).toBe('Failed2');
			}
		);
	});
});

describe('watchLocation', () => {
	it('Watch location calls the on success callback', async () => {
		expect.assertions(1);
		const geolocation = await makeGeolocation();
		geolocation.watchLocation(
			location => expect(location).toBeTruthy(),
			() => {}
		);
	});

	it('Watch location translate the location successfully', async () => {
		expect.assertions(2);
		const geolocation = await makeGeolocation();
		geolocation.watchLocation(
			location =>
				expect(location).toEqual({
					x: 0.25,
					y: 0.75,
					mapID: mockMapID,
				}),
			() => {}
		);
		mockWatchLocation.mockImplementation(
			(onSuccess: (location: GPS) => void) => {
				onSuccess({
					longitude: 1,
					latitude: 1,
				});
			}
		);
		geolocation.watchLocation(
			location =>
				expect(location).toEqual({
					x: 0.5,
					y: 0.5,
					mapID: mockMapID,
				}),
			() => {}
		);
	});

	it('Calls the onError call back when theres an error', async () => {
		expect.assertions(2);
		const geolocation = await makeGeolocation();
		mockWatchLocation.mockImplementation((_, onError) => {
			onError('Failed1');
		});
		geolocation.watchLocation(
			() => {},
			error => {
				expect(error).toBe('Failed1');
			}
		);
		mockWatchLocation.mockImplementation((_, onError) => {
			onError('Failed2');
		});
		geolocation.watchLocation(
			() => {},
			error => {
				expect(error).toBe('Failed2');
			}
		);
	});
});

describe('Stop watching', () => {
	it('Called the adapter stop watching', async () => {
		const geolocation = await makeGeolocation();
		geolocation.stopWatching();
		expect(mockStopWatching).toHaveBeenCalled();
	});
});
