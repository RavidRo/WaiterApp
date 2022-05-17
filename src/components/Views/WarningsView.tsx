import {observer} from 'mobx-react-lite';
import React, {useContext} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {MyLocationContext, OrdersContext} from '../../contexts';

type WarningsViewProps = {};

const WarningsView = observer((props: WarningsViewProps): JSX.Element => {
	const myLocation = useContext(MyLocationContext);
	const orders = useContext(OrdersContext);

	const unavailableOrders = orders.unavailableOrders;
	const outOfBoundsOrders = orders.outOfBoundsOrders;
	const outOfBound = myLocation.isCurrentLocationOutOfBound;
	const currentLocationError = myLocation.currentLocationError;

	return (
		<View style={styles.titleContainer}>
			{outOfBound && (
				<Text>{'>'} You're out side of the service area</Text>
			)}
			{currentLocationError && (
				<Text>
					{'>'} Could not get your location - {currentLocationError}
				</Text>
			)}
			{unavailableOrders.map(order => (
				<Text>
					{'>'} Order - {order.guestName ?? order.id.slice(0, 4)}:
					Guest's location is unavailable
				</Text>
			))}
			{outOfBoundsOrders.map(order => (
				<Text>
					{'>'} Order - {order.guestName ?? order.id.slice(0, 4)}:
					Guest is out side of service area
				</Text>
			))}
		</View>
	);
});

export default WarningsView;

const styles = StyleSheet.create({
	titleContainer: {
		backgroundColor: '#f2da9960',
		padding: 10,
	},
	title: {
		fontSize: 16,
		fontFamily: 'Montserrat-Medium',
	},
});
