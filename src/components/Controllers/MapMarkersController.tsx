import React, {useContext} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle, Text} from 'react-native';

import {observer} from 'mobx-react-lite';
import {Location} from '../../types/ido';

import WaiterMarker from '../Views/markers/WaiterMarker';
import GuestMarker from '../Views/markers/ClientMarker';

import MapLayoutController from './MapLayoutController';
import {PointMarker} from '../../types/map';
import {MyLocationContext, OrdersContext} from '../../contexts';

type MapMarkerControllerProps = {
	style?: StyleProp<ViewStyle>;
};

function createGuestMarker(myLocation?: Location): PointMarker | undefined {
	if (!myLocation) {
		return undefined;
	}

	const myLocationPoint = {name: 'Waiter', location: myLocation};
	return {point: myLocationPoint, marker: WaiterMarker};
}

const MapMarkersController = observer(({style}: MapMarkerControllerProps) => {
	const ordersViewModel = useContext(OrdersContext);

	//Guests Markers
	const guestsMarkers = ordersViewModel.availableOrders.map(order => {
		const orderName = order.guestName
			? order.guestName
			: order.id.slice(0, 5);

		return {
			point: {
				name: `${orderName} - ${order.status}`,
				location: order.guestLocation!,
			},
			marker: GuestMarker,
		};
	});

	//Waiter Marker
	const myLocationViewModel = useContext(MyLocationContext);
	const waiterMarker = createGuestMarker(myLocationViewModel.location);

	const allMarkers = guestsMarkers.concat(waiterMarker ? [waiterMarker] : []);

	const currentMap = myLocationViewModel.currentMap;
	if (!currentMap) {
		return (
			<View style={styles.loadingContainer}>
				<Text style={styles.loadingText}>Loading map...</Text>
			</View>
		);
	}

	return (
		<MapLayoutController
			markers={allMarkers}
			style={style}
			imageURL={currentMap.imageURL}
		/>
	);
});

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingText: {
		fontSize: 20,
	},
});

export default MapMarkersController;
