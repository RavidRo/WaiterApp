import {observer} from 'mobx-react-lite';
import React, {useContext, useState} from 'react';
import {OrdersContext} from '../../contexts';

import OrdersListView from '../Views/OrdersListView';

type OrdersProps = {};

const OrdersList = observer((_: OrdersProps) => {
	const ordersViewModel = useContext(OrdersContext);
	const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

	const selectOrder = (orderID: string) => {
		if (selectedOrders.includes(orderID)) {
			setSelectedOrders(prevSelectedOrders =>
				prevSelectedOrders.filter(id => id !== orderID)
			);
		} else {
			setSelectedOrders(prevSelectedOrders => [
				...prevSelectedOrders,
				orderID,
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
