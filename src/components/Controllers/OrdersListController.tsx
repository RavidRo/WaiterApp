import {observer} from 'mobx-react-lite';
import React, {useContext, useState} from 'react';
import {OrdersContext} from '../../contexts';

import OrdersListView from '../Views/OrdersListView';

type OrdersProps = {};

const OrdersList = observer((_: OrdersProps) => {
	const ordersViewModel = useContext(OrdersContext);
	const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

	const selectOrder = (orderId: string) => {
		if (selectedOrders.includes(orderId)) {
			setSelectedOrders(prevSelectedOrders =>
				prevSelectedOrders.filter(id => id !== orderId)
			);
		} else {
			setSelectedOrders(prevSelectedOrders => [
				...prevSelectedOrders,
				orderId,
			]);
		}
	};

	const orders = ordersViewModel.orders;

	return (
		<OrdersListView
			orders={orders}
			selectOrder={selectOrder}
			selectedOrdersID={selectedOrders}
		/>
	);
});

export default OrdersList;
