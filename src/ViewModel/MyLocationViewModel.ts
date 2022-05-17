import {Location, MapIDO} from '../types/ido';
import Geolocation from '../localization/Geolocation';
import {ILocationService} from '../localization/ILocationService';
import MyLocationModel from '../Models/MyLocationModel';
import Communicate from '../communication/Communicate';
import {PermissionsAndroid, Platform} from 'react-native';
import MapViewModel from './MapsViewModel';

export default class MyLocationViewModel {
	private locationService: ILocationService;
	private locationModel: MyLocationModel;
	private communicate: Communicate;
	private tracking: boolean;
	private mapViewModel: MapViewModel;

	constructor(communicate: Communicate, mapViewModel: MapViewModel) {
		this.locationModel = new MyLocationModel();
		this.locationService = new Geolocation(mapViewModel);
		this.communicate = communicate;
		this.tracking = false;
		this.mapViewModel = mapViewModel;
	}

	private isValidLocation(location: Location) {
		const isValidNumber = (n: number) => !isNaN(n) && isFinite(n);
		return isValidNumber(location.x) && isValidNumber(location.y);
	}

	private startTrackingLocation() {
		this.locationService.watchLocation(
			location => {
				if (!location) {
					console.warn('Location out of bounds', location);
					this.locationModel.location = undefined;
				} else if (this.isValidLocation(location)) {
					this.communicate.updateWaiterLocation(location);
					this.locationModel.location = location;
				} else {
					console.warn(
						'An invalid location has been received from the location service',
						location
					);
					this.locationModel.location = undefined;
				}
			},
			error => {
				console.warn('Could not get the user location', error);
				this.locationModel.location = undefined;
			}
		);
	}

	public startTrackingLocationWhenApproved() {
		this.tracking = true;
		if (this.locationModel.locationApproved) {
			this.startTrackingLocation();
		}
	}

	get location(): Location | undefined {
		return this.locationModel.location;
	}

	get locationApproved() {
		return this.locationModel.locationApproved;
	}

	get currentMap(): MapIDO | undefined {
		return this.location
			? this.mapViewModel.getMapByID(this.location.mapID)
			: this.mapViewModel.defaultMap;
	}

	private approve() {
		this.locationModel.approve();
		if (this.tracking) {
			this.startTrackingLocation();
		}
	}

	public askLocationApproval = () => {
		const approvingLocationRequest =
			Platform.OS === 'android'
				? PermissionsAndroid.request(
						PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
						// eslint-disable-next-line no-mixed-spaces-and-tabs
				  )
				: Promise.reject('IOS is not supported');

		return approvingLocationRequest
			.catch(() => {
				return Promise.reject(
					'Location needs to be approved for the user to watch your location'
				);
			})
			.then(value => {
				if (value === 'granted') {
					return this.approve();
				} else if (value === 'never_ask_again') {
					return Promise.reject(
						'Pls enable location permission in the Settings -> Apps -> service_everywhere'
					);
				} else {
					return Promise.reject(
						'Location needs to be approved for the user to watch your location'
					);
				}
			});
	};
}
