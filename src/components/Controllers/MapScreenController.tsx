import React, {useContext, useRef} from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import {ConnectionContext, MyLocationContext} from '../../contexts';
import MapScreenView from '../Views/MapScreenView';

export default function MapScreenController(): JSX.Element {
	const refBottomSheet = useRef<RBSheet>(null);
	const connectViewModel = useContext(ConnectionContext);
	const myLocationViewModel = useContext(MyLocationContext);

	const openBottomSheet = () => {
		refBottomSheet.current?.open();
	};

	return (
		<MapScreenView
			refBottomSheet={refBottomSheet}
			openBottomSheet={openBottomSheet}
			mapName={myLocationViewModel.currentMap?.name}
			myName={connectViewModel.myName}
		/>
	);
}
