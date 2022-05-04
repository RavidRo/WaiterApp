import {Corners, Location} from '../types/ido';
import Geolocation from '../localization/Geolocation';
import {ILocationService} from '../localization/ILocationService';
import MyLocationModel from '../Models/MyLocationModel';
import configuration from '../../configuration.json';
import Communicate from '../communication/Communicate';

const corners: Corners = {
	bottomRightGPS: configuration.corners['bottom-right-gps'],
	bottomLeftGPS: configuration.corners['bottom-left-gps'],
	topRightGPS: configuration.corners['top-right-gps'],
	topLeftGPS: configuration.corners['top-left-gps'],
};
export default class MyLocationViewModel {
	private locationService: ILocationService;
	private locationModel: MyLocationModel;
	private communicate: Communicate;
	private tracking: boolean;

	constructor(communicate: Communicate) {
		this.locationModel = new MyLocationModel();
		this.locationService = new Geolocation(corners);
		this.communicate = communicate;
		this.tracking = false;
	}

	private isValidLocation(location: Location) {
		const isValidNumber = (n: number) => !isNaN(n) && isFinite(n);
		return isValidNumber(location.x) && isValidNumber(location.y);
	}

	private startTrackingLocation() {
		this.locationService.watchLocation(
			location => {
				if (this.isValidLocation(location)) {
					this.communicate.updateWaiterLocation(location);
					this.locationModel.location = location;
				} else {
					console.warn(
						'An invalid location has been received from the location service',
						location
					);
				}
			},
			error => {
				console.warn('Could not get the user location', error);
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

	approve() {
		this.locationModel.approve();
		if (this.tracking) {
			this.startTrackingLocation();
		}
	}
}
