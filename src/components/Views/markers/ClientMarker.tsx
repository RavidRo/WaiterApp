import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

import {Marker} from '../../../types/map';

const SIZE = 15;

const GuestMarker: Marker = ({scale, name}) => {
	const styles = StyleSheet.create({
		container: {flexDirection: 'row', alignItems: 'center'},
		point: {
			width: SIZE * scale,
			height: SIZE * scale,
			borderRadius: (SIZE * scale) / 2,
			backgroundColor: 'orange',
			// position: 'absolute',

			borderColor: 'black',
			borderWidth: 2,
			marginRight: 4,
		},
		text: {
			// width: 50,
			// position: 'absolute',
			fontWeight: '800',
			fontSize: 16,
			bottom: 0,
			left: 0,
			textTransform: 'capitalize',
			color: 'black',
			textShadowColor: 'orange',
			// textDecorationStyle: 'solid',
			// textDecorationColor: 'black',
			textShadowOffset: {
				height: 0,
				width: 0,
			},
			textShadowRadius: 5,
		},
	});

	return (
		<View style={styles.container}>
			<View style={styles.point} />
			<Text style={styles.text}>{name}</Text>
		</View>
	);
};

export default GuestMarker;
