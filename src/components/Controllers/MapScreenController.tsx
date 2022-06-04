import {observer} from 'mobx-react-lite';
import React, {useContext, useRef} from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import {OrdersContext} from '../../contexts';
import MapScreenView from '../Views/MapScreenView';

type MapScreenControllerProps = {
	refresh: () => void;
};
function MapScreenController(props: MapScreenControllerProps): JSX.Element {
	const refBottomSheet = useRef<RBSheet>(null);
	const ordersViewModel = useContext(OrdersContext);

	const openBottomSheet = () => {
		refBottomSheet.current?.open();
	};

	return (
		<MapScreenView
			refBottomSheet={refBottomSheet}
			openBottomSheet={openBottomSheet}
			newOrdersUpdates={ordersViewModel.orders.some(
				order => order.updated
			)}
			onOrdersClose={() => ordersViewModel.clearUpdates()}
			refresh={props.refresh}
		/>
	);
}

export default observer(MapScreenController);
