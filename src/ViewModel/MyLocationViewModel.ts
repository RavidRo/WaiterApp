import {Corners, Location} from '../types/ido';
import Geolocation from '../localization/Geolocation';
import {ILocationService} from '../localization/ILocationService';
import MyLocationModel from '../Models/MyLocationModel';
import configuration from '../../configuration.json';
import Communicate from '../communication/Communicate';
import OrderViewModel from './OrderViewModel';

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

	constructor(communicate: Communicate) {
		this.locationModel = new MyLocationModel();
		this.locationService = new Geolocation(corners);
		this.communicate = communicate;
	}

	startTrackingLocation() {
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

	get location(): Location | undefined {
		return this.locationModel.location;
	}
}
