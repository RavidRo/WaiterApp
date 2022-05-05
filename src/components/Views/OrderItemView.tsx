import {observer} from 'mobx-react-lite';
import React from 'react';
import {View, StyleSheet, Button, Text, TouchableOpacity} from 'react-native';
import Order from '../../Models/Order';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
	faSortDown,
	faSortUp,
	faChevronDown,
	faChevronUp,
	faAngleDown,
	faAngleUp,
	faSquareCaretDown,
	faCircle,
} from '@fortawesome/free-solid-svg-icons';

type OrderItemViewProps = {
	order: Order;
	selected: boolean;
	evenItem: boolean;
	deliver: (orderID: string) => void;
	onTheWay: (orderID: string) => void;
	selectOrder: (string: string) => void;
	loading: boolean;
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
						{/* TODO: Instead of 'Order' write the name of the guest */}
						{`Order - ${props.order.id.slice(0, 5)}  < `}
						<Text style={styles.orderStatus}>
							{props.order.orderStatus}
						</Text>
						{' >'}
					</Text>
				</View>
				{props.selected && (
					<View style={styles.items}>
						{Object.entries(props.order.items).map(
							([name, quantity], index) => (
								<View key={index} style={styles.titleContainer}>
									{/* <FontAwesomeIcon
										icon={faCircle}
										size={5}
										style={styles.iconStyle}
									/> */}
									<Text style={styles.itemsText}>
										{quantity} - {name}
									</Text>
								</View>
							)
						)}
						<View style={styles.statusButton}>
							{props.order.orderStatus === 'on the way' && (
								<Button
									title='delivered'
									onPress={() =>
										props.deliver(props.order.id)
									}
									disabled={props.loading}
								/>
							)}
							{props.order.orderStatus === 'assigned' && (
								<Button
									title='on the way'
									onPress={() =>
										props.onTheWay(props.order.id)
									}
									disabled={props.loading}
									color={'green'}
								/>
							)}
						</View>
					</View>
				)}
			</View>
		</TouchableOpacity>
	);
});

const styles = StyleSheet.create({
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
