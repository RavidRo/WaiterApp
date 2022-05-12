import {Location} from '../types/ido';
import ConnectionHandler from './ConnectionHandler';

export default class Communicate {
	private connectionHandler: ConnectionHandler;
	constructor(connectionHandler: ConnectionHandler) {
		this.connectionHandler = connectionHandler;
	}

	updateWaiterLocation(waiterLocation: Location): void {
		this.connectionHandler.send('updateWaiterLocation', {
			location: waiterLocation,
		});
	}
}
