import {Location, MapIDO} from '../types/ido';
import Geolocation from '../localization/Geolocation';
import {ILocationService} from '../localization/ILocationService';
import MyLocationModel from '../Models/MyLocationModel';
import Communicate from '../communication/Communicate';
import {PermissionsAndroid, Platform} from 'react-native';
import MapsViewModel from './MapsViewModel';

export default class MyLocationViewModel {
	private locationService: ILocationService;
	private locationModel: MyLocationModel;
	private communicate: Communicate;
	private tracking: boolean;
	private mapViewModel: MapsViewModel;

	constructor(communicate: Communicate, mapViewModel: MapsViewModel) {
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
					const error = 'Outside of service area';
					this.communicate.locationErrorWaiter(error);
					this.locationModel.location = undefined;
					this.locationModel.locationError = error;
				} else if (this.isValidLocation(location)) {
					this.communicate.updateWaiterLocation(location);
					this.locationModel.location = location;
					this.locationModel.locationError = undefined;
				} else {
					const error = 'Unexpected error, received invalid location';
					this.communicate.locationErrorWaiter(error);
					this.locationModel.location = undefined;
					this.locationModel.locationError = error;
				}
			},
			error => {
				this.communicate.locationErrorWaiter(error);
				this.locationModel.location = undefined;
				this.locationModel.locationError = error;
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

	get currentOrDefaultMap(): MapIDO | undefined {
		return this.location
			? this.mapViewModel.getMapByID(this.location.mapID)
			: this.mapViewModel.defaultMap;
	}

	get currentMap(): MapIDO | undefined {
		return this.location
			? this.mapViewModel.getMapByID(this.location.mapID)
			: undefined;
	}

	get currentLocationError(): string | undefined {
		return this.locationModel.locationError;
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
				this.communicate.locationErrorWaiter(
					'Location services are not approved'
				);
				return Promise.reject(
					'Location needs to be approved for the guests to watch your location'
				);
			})
			.then(value => {
				if (value === 'granted') {
					return this.approve();
				} else if (value === 'never_ask_again') {
					return Promise.reject(
						'Pls enable location permission in Settings -> Apps -> service_everywhere'
					);
				} else {
					this.communicate.locationErrorWaiter(
						'Location services are not approved'
					);
					return Promise.reject(
						'Location needs to be approved for the guests to watch your location'
					);
				}
			});
	};
}
