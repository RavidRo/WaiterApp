import React from 'react';
import {
	LayoutChangeEvent,
	StyleProp,
	Text,
	View,
	ViewStyle,
} from 'react-native';
import {PointMarker} from '../../types/map';
import ZoomableImageController from '../Controllers/ZoomableImageController';

type MapViewProps = {
	style?: StyleProp<ViewStyle>;
	markers: PointMarker[];
	onLayout: (event: LayoutChangeEvent) => void;
	imageHeight: number | undefined;
	imageWidth: number | undefined;
	width: number | undefined;
	height: number | undefined;
	imageURL: string;
	error?: string;
};

export default function MapView(props: MapViewProps) {
	return (
		<View style={props.style} onLayout={props.onLayout}>
			{props.imageHeight &&
			props.imageWidth &&
			props.width &&
			props.height ? (
				<ZoomableImageController
					imageHeight={props.imageHeight}
					imageWidth={props.imageWidth}
					url={props.imageURL}
					pointsOfInterest={props.markers}
					parentWidth={props.width}
					parentHeight={props.height}
				/>
			) : props.error ? (
				<Text>{props.error}</Text>
			) : (
				<Text>Loading map's image...</Text>
			)}
		</View>
	);
}
