import {createContext} from 'react';
import Communicate from './communication/Communicate';
import ConnectionHandler from './communication/ConnectionHandler';
import Notifications from './communication/Notifications';
import Requests from './networking/Requests';
import ConnectionViewModel from './ViewModel/ConnectionViewModel';
import {ItemViewModel} from './ViewModel/ItemViewModel';
import MapViewModel from './ViewModel/MapsViewModel';
import MyLocationViewModel from './ViewModel/MyLocationViewModel';
import OrderViewModel from './ViewModel/OrderViewModel';

const requests = new Requests();

const items = new ItemViewModel(requests);
const orders = new OrderViewModel(requests, items);

const notifications = new Notifications(orders);
const connectionHandler = new ConnectionHandler(notifications);
const communicate = new Communicate(connectionHandler);

const maps = new MapViewModel(requests);
const myLocation = new MyLocationViewModel(communicate, maps);
const connection = new ConnectionViewModel(
	requests,
	orders,
	items,
	myLocation,
	connectionHandler,
	maps
);

export const ConnectionContext = createContext<ConnectionViewModel>(connection);
export const OrdersContext = createContext<OrderViewModel>(orders);
export const itemsContext = createContext<ItemViewModel>(items);
export const MapsContext = createContext<MapViewModel>(maps);
export const MyLocationContext = createContext<MyLocationViewModel>(myLocation);

export const __test__ = {
	notifications,
};
