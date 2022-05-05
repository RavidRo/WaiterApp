import {observer} from 'mobx-react-lite';
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Order from '../../Models/Order';
import OrderItemController from '../Controllers/OrderItemController';

type OrdersViewProps = {
	orders: Order[];
	selectOrder: (string: string) => void;
	selectedOrderID: string | undefined;
};

const OrdersListView = observer((props: OrdersViewProps) => {
	return (
		<View style={styles.container}>
			{props.orders.length === 0 ? (
				<View style={styles.noOrders}>
					<Text style={styles.noOrdersText}>
						You are not assigned to any orders
					</Text>
				</View>
			) : (
				<View style={styles.titleContainer}>
					<Text style={styles.title}>Your assigned orders</Text>
				</View>
			)}
			{props.orders.map((order, index) => (
				<OrderItemController
					evenItem={index % 2 === 0}
					order={order}
					selectOrder={props.selectOrder}
					key={order.id}
					selectedOrderID={props.selectedOrderID}
				/>
			))}
		</View>
	);
});
export default OrdersListView;

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 20,
		paddingTop: 10,
	},
	noOrders: {
		paddingTop: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	noOrdersText: {
		fontSize: 20,
	},
	titleContainer: {
		marginBottom: 5,
	},
	title: {
		fontSize: 20,
		fontFamily: 'Montserrat-Medium',
	},
});
