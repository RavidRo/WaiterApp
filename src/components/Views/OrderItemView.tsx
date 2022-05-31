import {observer} from 'mobx-react-lite';
import React from 'react';
import {View, StyleSheet, Button, Text, TouchableOpacity} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAngleDown, faAngleUp} from '@fortawesome/free-solid-svg-icons';
import {UIOrder} from '../../ViewModel/OrderViewModel';
import NotificationIcon from './NotificationIcon';

type OrderItemViewProps = {
	order: UIOrder;
	selected: boolean;
	evenItem: boolean;
	deliver: (orderID: string) => void;
	onTheWay: (orderID: string) => void;
	dismissOrder: (orderID: string) => void;
	selectOrder: (string: string) => void;
	loading: boolean;
	unknownLocation: boolean;
	fetchGuestDetails: (guestID: string) => void;
	loadingGuest: boolean;
	guestsDetailsAvailable: boolean;
	locationOutOfBounds: boolean;
	mapName: string | undefined;
};

export default observer(function OrderItemView(props: OrderItemViewProps) {
	const orderName = props.order.guestName
		? `${props.order.guestName}`
		: `Order - ${props.order.id.slice(0, 5)}`;

	const warnings = [
		...(props.unknownLocation ? ["Guest's location is unknown"] : []),
		...(props.locationOutOfBounds
			? ["Guest's location is out of the serving area"]
			: []),
	];
	const warningsWithDetails =
		warnings.length > 0 && props.guestsDetailsAvailable
			? [...warnings, `Phone number: ${props.order.guestPhoneNumber}`]
			: [];

	return (
		<TouchableOpacity
			onPress={() => props.selectOrder(props.order.id)}
			testID='orderItem'>
			<View
				style={[
					styles.orderContainer,
					// props.evenItem ? styles.background1 : styles.background2,
				]}>
				<View style={styles.titleContainer}>
					<FontAwesomeIcon
						icon={props.selected ? faAngleDown : faAngleUp}
						size={15}
						style={styles.iconStyle}
					/>

					<Text style={styles.orderText} testID='orderTitle'>
						{orderName}
						{` - ${props.order.status}`}
						{` - ${props.mapName ?? 'unknown'}`}
					</Text>

					{props.order.updated && <NotificationIcon />}
				</View>
				<View style={styles.items}>
					{warningsWithDetails.map((warning, index) => (
						<Text key={index} style={styles.dismiss}>
							{warning}
						</Text>
					))}
					{props.selected && (
						<>
							{Object.entries(props.order.items).map(
								([name, quantity], index) => (
									<View
										key={index}
										style={styles.titleContainer}>
										<Text style={styles.itemsText}>
											{quantity} - {name}
										</Text>
									</View>
								)
							)}
							<View style={styles.statusButton}>
								{props.order.status === 'on the way' ? (
									<Button
										title='delivered'
										onPress={() =>
											props.deliver(props.order.id)
										}
										disabled={props.loading}
									/>
								) : props.order.status === 'assigned' ? (
									<Button
										title='on the way'
										onPress={() =>
											props.onTheWay(props.order.id)
										}
										disabled={props.loading}
										color={'green'}
									/>
								) : (
									<Button
										title='dismiss'
										onPress={() =>
											props.dismissOrder(props.order.id)
										}
										disabled={props.loading}
										color={'#d68383'}
										testID='dismissButton'
									/>
								)}
								{!props.guestsDetailsAvailable && (
									<Button
										title="fetch guest's details"
										onPress={() =>
											props.fetchGuestDetails(
												props.order.guestID
											)
										}
										disabled={props.loadingGuest}
										color={'#d68383'}
									/>
								)}
							</View>
						</>
					)}
				</View>
			</View>
		</TouchableOpacity>
	);
});

const styles = StyleSheet.create({
	dismiss: {
		marginBottom: 7,
		color: '#ad9d11',
		fontFamily: 'Montserrat-Bold',
	},
	iconStyle: {
		marginRight: 5,
	},
	titleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	background1: {
		backgroundColor: '#f5dabc',
	},
	background2: {
		backgroundColor: '#bcd8f5',
	},
	orderContainer: {
		paddingVertical: 7,
	},
	itemsText: {
		fontFamily: 'Montserrat-Medium',
		fontSize: 18,
	},
	orderText: {
		textTransform: 'capitalize',
		fontFamily: 'Montserrat-Medium',
		fontSize: 18,
	},
	orderStatus: {
		fontFamily: 'Montserrat-Bold',
		fontSize: 18,
		textTransform: 'uppercase',
	},
	items: {
		marginTop: 5,
		paddingHorizontal: 30,
	},
	statusButton: {
		marginTop: 15,
	},
});
