import ConnectionHandler from '../communication/ConnectionHandler';
import ConnectionModel from '../Models/ConnectionModel';
import Requests from '../networking/Requests';
import {ItemViewModel} from './ItemViewModel';
import MapsViewModel from './MapsViewModel';
import MyLocationViewModel from './MyLocationViewModel';
import OrderViewModel from './OrderViewModel';

export default class ConnectionViewModel {
	private requests: Requests;
	private model: ConnectionModel;
	private connectionHandler: ConnectionHandler;
	private orders: OrderViewModel;
	private items: ItemViewModel;
	private myLocation: MyLocationViewModel;
	private maps: MapsViewModel;

	constructor(
		requests: Requests,
		orderViewModel: OrderViewModel,
		itemViewModel: ItemViewModel,
		myLocationViewModel: MyLocationViewModel,
		connectionHandler: ConnectionHandler,
		mapsViewModel: MapsViewModel
	) {
		this.model = ConnectionModel.getInstance();
		this.connectionHandler = connectionHandler;
		this.requests = requests;
		this.orders = orderViewModel;
		this.items = itemViewModel;
		this.myLocation = myLocationViewModel;
		this.maps = mapsViewModel;
	}

	login(username: string, password: string): Promise<string> {
		return this.requests.login(username, password).then(token => {
			console.info('Logged in with token:', token);
			this.model.token = token;
			return token;
		});
	}

	get connection(): ConnectionModel {
		return this.model;
	}

	get myName(): string | undefined {
		return this.model.name;
	}

	private getMyName() {
		return this.requests.getWaiterName().then(name => {
			this.model.name = name;
		});
	}

	public connect() {
		const promises = [
			this.maps.syncMaps(),
			this.orders.synchronizeOrders(),
			this.items.syncItems(),
			this.getMyName(),
			new Promise<void>((resolve, reject) => {
				if (this.model.token) {
					this.connectionHandler.connect(
						this.model.token,
						() => resolve(),
						() =>
							reject(
								'Could not connect to server, please try again later'
							)
					);
				} else {
					reject(
						'Tried to connect but an authorization token could not be found'
					);
				}
			}),
		];

		return Promise.all(promises).then(() => {
			this.myLocation.startTrackingLocationWhenApproved();
		});
	}
}
