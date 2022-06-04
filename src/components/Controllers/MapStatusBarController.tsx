import React, {useContext} from 'react';
import {ConnectionContext, MyLocationContext} from '../../contexts';
import MapStatusBarView from '../Views/MapStatusBarView';

type MapStatusBarControllerProps = {
	refresh: () => void;
};

export default function MapStatusBarController(
	props: MapStatusBarControllerProps
) {
	const connectViewModel = useContext(ConnectionContext);
	const myLocationViewModel = useContext(MyLocationContext);

	const mapName = myLocationViewModel.currentMap?.name;
	const myName = connectViewModel.myName;
	return (
		<MapStatusBarView
			mapName={mapName}
			myName={myName}
			refresh={props.refresh}
		/>
	);
}
