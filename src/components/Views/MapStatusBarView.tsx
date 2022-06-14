import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowRotateRight} from '@fortawesome/free-solid-svg-icons';

type MapStatusBarViewProps = {
	myName?: string;
	mapName?: string;
	unavailableLocation: boolean;
	refresh: () => void;
};

export default function MapStatusBarView(props: MapStatusBarViewProps) {
	const hello = `Hey ${props.myName ?? ''},`;
	const prefixLocation = props.unavailableLocation ? '' : "you're in";
	const location = props.unavailableLocation
		? 'your location is unavailable'
		: props.mapName ?? 'Loading Location...';
	return (
		<View style={styles.titleContainer}>
			<Text style={styles.title}>
				{`${hello} ${prefixLocation} `}
				<Text style={styles.location}>{location}</Text>
			</Text>
			<TouchableOpacity onPress={() => props.refresh()}>
				<FontAwesomeIcon
					icon={faArrowRotateRight}
					size={15}
					// style={styles.iconStyle}
				/>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		backgroundColor: '#99cbf2',
		borderBottomColor: '#99cbf290',
		borderBottomWidth: 1,
		padding: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	title: {
		fontSize: 16,
		fontFamily: 'Montserrat-Medium',
	},
	location: {
		fontFamily: 'Montserrat-SemiBold',
	},
});
