import {Corners, Location} from '../types/ido';
import Geolocation from '../localization/Geolocation';
import {ILocationService} from '../localization/ILocationService';
import MyLocationModel from '../Models/MyLocationModel';
import configuration from '../../configuration.json';
import Communicate from '../communication/Communicate';

const corners: Corners = {
	bottomRightGPS: configuration.corners['bottom-right-gps'],
	bottomLeftGPS: configuration.corners['bottom-left-gps'],
	topRightGPS: configuration.corners['bottom-right-gps'],
	topLeftGPS: configuration.corners['bottom-left-gps'],
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

	private startTrackingLocation() {
		this.locationService.watchLocation(
			location => {
				this.communicate.updateWaiterLocation(location);
				this.locationModel.location = location;
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
