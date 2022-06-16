import {observer} from 'mobx-react-lite';
import React, {useContext} from 'react';
import {ConnectionContext, MyLocationContext} from '../../contexts';
import MapStatusBarView from '../Views/MapStatusBarView';

type MapStatusBarControllerProps = {
	refresh: () => void;
};

export default observer(function MapStatusBarController(
	props: MapStatusBarControllerProps
) {
	const connectViewModel = useContext(ConnectionContext);
	const myLocationViewModel = useContext(MyLocationContext);

	const unavailableLocation =
		myLocationViewModel.currentLocationError !== undefined;

	const mapName = myLocationViewModel.currentMap?.name;
	const myName = connectViewModel.myName;
	return (
		<MapStatusBarView
			mapName={mapName}
			myName={myName}
			unavailableLocation={unavailableLocation}
			refresh={props.refresh}
		/>
	);
});
