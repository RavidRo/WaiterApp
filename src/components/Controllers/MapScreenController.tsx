import {observer} from 'mobx-react-lite';
import React, {useContext, useRef} from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
	ConnectionContext,
	MyLocationContext,
	OrdersContext,
} from '../../contexts';
import MapScreenView from '../Views/MapScreenView';

function MapScreenController(): JSX.Element {
	const refBottomSheet = useRef<RBSheet>(null);
	const connectViewModel = useContext(ConnectionContext);
	const myLocationViewModel = useContext(MyLocationContext);
	const ordersViewModel = useContext(OrdersContext);

	const openBottomSheet = () => {
		refBottomSheet.current?.open();
	};

	return (
		<MapScreenView
			refBottomSheet={refBottomSheet}
			openBottomSheet={openBottomSheet}
			mapName={myLocationViewModel.currentMap?.name}
			myName={connectViewModel.myName}
			newOrdersUpdates={ordersViewModel.orders.some(
				order => order.updated
			)}
			onOrdersClose={() => ordersViewModel.clearUpdates()}
		/>
	);
}

export default observer(MapScreenController);
