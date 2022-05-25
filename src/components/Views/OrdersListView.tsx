import {observer} from 'mobx-react-lite';
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {UIOrder} from '../../ViewModel/OrderViewModel';
import OrderItemController from '../Controllers/OrderItemController';

type OrdersViewProps = {
	orders: UIOrder[];
	selectOrder: (string: string) => void;
	selectedOrdersID: string[];
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
			<View testID='ordersList'>
				{props.orders.map((order, index) => (
					<OrderItemController
						evenItem={index % 2 === 0}
						order={order}
						selectOrder={props.selectOrder}
						key={order.id}
						selectedOrdersID={props.selectedOrdersID}
					/>
				))}
			</View>
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
