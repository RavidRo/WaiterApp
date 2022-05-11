import {observer} from 'mobx-react-lite';
import React from 'react';
import {View, StyleSheet, Button, Text, TouchableOpacity} from 'react-native';
import Order from '../../Models/Order';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAngleDown, faAngleUp} from '@fortawesome/free-solid-svg-icons';
import {UIOrder} from '../../ViewModel/OrderViewModel';

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
};

export default observer(function OrderItemView(props: OrderItemViewProps) {
	return (
		<TouchableOpacity onPress={() => props.selectOrder(props.order.id)}>
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

					<Text style={styles.orderText}>
						{props.order.guestName
							? `${props.order.guestName} < `
							: `Order - ${props.order.id.slice(0, 5)}  < `}
						<Text style={styles.orderStatus}>
							{props.order.orderStatus}
						</Text>
						{' >'}
					</Text>
				</View>
				<View style={styles.items}>
					{props.unknownLocation && (
						<>
							<Text style={styles.dismiss}>
								Guess'ts location is unknown
							</Text>
							{props.guestsDetailsAvailable && (
								<Text style={styles.dismiss}>
									Guess'ts phone number -{' '}
									{props.order.guestPhoneNumber}
								</Text>
							)}
						</>
					)}
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
								{props.order.orderStatus === 'on the way' ? (
									<Button
										title='delivered'
										onPress={() =>
											props.deliver(props.order.id)
										}
										disabled={props.loading}
									/>
								) : props.order.orderStatus === 'assigned' ? (
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
