// import {faBell} from '@fortawesome/free-solid-svg-icons';
// import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {View, StyleSheet} from 'react-native';

export default function NotificationIcon() {
	return (
		<View style={styles.iconCircle}>
			{/* <FontAwesomeIcon icon={faBell} size={13} color={'#8f6e46'} /> */}
		</View>
	);
}

const styles = StyleSheet.create({
	iconCircle: {
		backgroundColor: '#d18b6b',
		borderRadius: 100,
		padding: 6,
		margin: 7,
	},
});
