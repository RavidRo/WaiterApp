import React, {useRef} from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import MapScreenView from '../Views/MapScreenView';

export default function MapScreenController(): JSX.Element {
	const refBottomSheet = useRef<RBSheet>(null);

	const openBottomSheet = () => {
		refBottomSheet.current?.open();
	};

	return (
		<MapScreenView
			refBottomSheet={refBottomSheet}
			openBottomSheet={openBottomSheet}
		/>
	);
}
