import React, {useContext, useRef} from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import {ConnectionContext} from '../../contexts';
// import {MyLocationContext} from '../../contexts';
import MapScreenView from '../Views/MapScreenView';
import configuration from '../../../configuration.json';

export default function MapScreenController(): JSX.Element {
	const refBottomSheet = useRef<RBSheet>(null);
	const connectViewModel = useContext(ConnectionContext);
	// const myLocationViewModel = useContext(MyLocationContext);
	// myLocationViewModel.location

	const openBottomSheet = () => {
		refBottomSheet.current?.open();
	};

	return (
		<MapScreenView
			refBottomSheet={refBottomSheet}
			openBottomSheet={openBottomSheet}
			mapName={configuration['map-name']}
			myName={connectViewModel.myName}
		/>
	);
}
