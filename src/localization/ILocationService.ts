import {Location} from '../types/ido';

export interface ILocationService {
	getLocation(
		successCallback: (location?: Location) => void,
		errorCallback: (error: string) => void
	): void;

	watchLocation(
		successCallback: (location?: Location) => void,
		errorCallback: (error: string) => void
	): void;

	stopWatching(): void;
}
