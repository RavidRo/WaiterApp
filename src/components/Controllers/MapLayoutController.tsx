import React, {useContext, useState} from 'react';
import {Image, LayoutChangeEvent, StyleProp, ViewStyle} from 'react-native';

import MapView from '../Views/MapView';
import {PointMarker} from '../../types/map';
import {MapsContext} from '../../contexts';

type MapLayoutProps = {
	style?: StyleProp<ViewStyle>;
	markers: PointMarker[];
};

export default function MapLayoutController({style, markers}: MapLayoutProps) {
	const mapViewModel = useContext(MapsContext);
	const imageURL = mapViewModel.getMapDetails().imageURL;

	const [imageWidth, setImageWidth] = useState<number | undefined>();
	const [imageHeight, setImageHeight] = useState<number | undefined>();
	const [width, setWidth] = useState<number | undefined>();
	const [height, setHeight] = useState<number | undefined>();

	Image.getSize(imageURL, (newImageWidth, newImageHeight) => {
		setImageWidth(newImageWidth);
		setImageHeight(newImageHeight);
	});

	const onLayout = (event: LayoutChangeEvent) => {
		const {height: newHeight, width: newWidth} = event.nativeEvent.layout;
		setHeight(newHeight);
		setWidth(newWidth);
	};

	const props = {
		style,
		onLayout,
		imageWidth,
		imageHeight,
		width,
		height,
		markers,
		imageURL,
	};

	return <MapView {...props} />;
}
