import {autorun} from 'mobx';

import {Location} from '../types/ido';
import {GPS} from '../types/map';
import MapsViewModel from '../ViewModel/MapsViewModel';
import GeolocationAdapter from './GeolocationAdapter';

import {ILocationService} from './ILocationService';
import LocationMap from './Map';

export default class Geolocation implements ILocationService {
	private readonly geolocationAdapter: GeolocationAdapter;
	private maps: LocationMap[] = [];

	constructor(mapsViewModel: MapsViewModel) {
		autorun(() => {
			this.maps = mapsViewModel.maps.map(map => new LocationMap(map));
		});
		this.geolocationAdapter = new GeolocationAdapter();
	}

	private translateFunction(successCallback: (location?: Location) => void) {
		return (location: GPS) => {
			for (const map of this.maps) {
				if (map.hasInside(location)) {
					const newLocation = map.translateGps(location);
					return successCallback(newLocation);
				}
			}
			return successCallback(undefined);
		};
	}

	watchLocation(
		successCallback: (location?: Location) => void,
		errorCallback: (error: string) => void
	) {
		this.geolocationAdapter.watchLocation(
			this.translateFunction(successCallback),
			errorCallback
		);
	}

	getLocation(
		successCallback: (location?: Location) => void,
		errorCallback: (error: string) => void
	): void {
		this.geolocationAdapter.getLocation(
			this.translateFunction(successCallback),
			errorCallback
		);
	}

	stopWatching(): void {
		this.geolocationAdapter.stopWatching();
	}
}
