import React, {useState} from 'react';
import {Image, LayoutChangeEvent, StyleProp, ViewStyle} from 'react-native';

import MapView from '../Views/MapView';
import {PointMarker} from '../../types/map';

type MapLayoutProps = {
	style?: StyleProp<ViewStyle>;
	markers: PointMarker[];
	imageURL: string;
};

export default function MapLayoutController({
	style,
	markers,
	imageURL,
}: MapLayoutProps) {
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
