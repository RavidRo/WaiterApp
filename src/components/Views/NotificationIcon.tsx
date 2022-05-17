import {faExclamation} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {View, StyleSheet} from 'react-native';

export default function NotificationIcon() {
	return (
		<View style={styles.iconCircle}>
			<FontAwesomeIcon icon={faExclamation} size={15} />
		</View>
	);
}

const styles = StyleSheet.create({
	iconCircle: {
		backgroundColor: 'orange',
		borderRadius: 100,
		padding: 2,
		borderWidth: 1,
		borderColor: '#6666',
		margin: 5,
	},
});
