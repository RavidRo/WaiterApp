import {WaiterCommunication} from '../types/api';
import {Location} from '../types/ido';
import ConnectionHandler from './ConnectionHandler';

export default class Communicate implements WaiterCommunication {
	private connectionHandler: ConnectionHandler;
	constructor(connectionHandler: ConnectionHandler) {
		this.connectionHandler = connectionHandler;
	}

	updateWaiterLocation(waiterLocation: Location): void {
		this.connectionHandler.send('updateWaiterLocation', {
			location: waiterLocation,
		});
	}

	locationErrorWaiter(errorMsg: string): void {
		this.connectionHandler.send('locationErrorWaiter', {errorMsg});
	}
}
