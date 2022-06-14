import {MapIDO} from '../types/ido';
import {GPS} from '../types/map';
export default class LocationMap {
	private readonly map: MapIDO;

	private readonly width: number;
	private readonly height: number;

	constructor(map: MapIDO) {
		this.map = map;
		const corners = map.corners;
		this.width =
			corners.bottomRightGPS.longitude - corners.bottomLeftGPS.longitude;
		this.height =
			corners.topRightGPS.latitude - corners.bottomRightGPS.latitude;
	}

	private distanceFromLine(end1: GPS, end2: GPS, p: GPS) {
		const numerator =
			(end2.longitude - end1.longitude) * (end1.latitude - p.latitude) -
			(end1.longitude - p.longitude) * (end2.latitude - end1.latitude);
		const denominator =
			(end2.longitude - end1.longitude) ** 2 +
			(end2.latitude - end1.latitude) ** 2;
		return Math.abs(numerator) / Math.sqrt(denominator);
	}

	translateGps(location: GPS) {
		const corners = this.map.corners;

		// TODO: The sign calculation are not precise for maps that are not parallel to the equator.

		const signX =
			corners.topLeftGPS.longitude > location.longitude ? -1 : 1;
		const localX =
			this.distanceFromLine(
				corners.topLeftGPS,
				corners.bottomLeftGPS,
				location
			) / this.width;

		const signY = corners.topLeftGPS.latitude < location.latitude ? -1 : 1;
		const localY =
			this.distanceFromLine(
				corners.topLeftGPS,
				corners.topRightGPS,
				location
			) / this.height;

		return {x: localX * signX, y: localY * signY, mapID: this.map.id};
	}

	hasInside(location: GPS) {
		const localLocation = this.translateGps(location);
		const inRange = (value: number) => value >= 0 && value <= 1;
		return inRange(localLocation.x) && inRange(localLocation.y);
	}
}
