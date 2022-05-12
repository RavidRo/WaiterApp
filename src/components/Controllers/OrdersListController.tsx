import {observer} from 'mobx-react-lite';
import React, {useContext, useState} from 'react';
import {OrdersContext} from '../../contexts';

import OrdersListView from '../Views/OrdersListView';

type OrdersProps = {};

const OrdersList = observer((_: OrdersProps) => {
	const ordersViewModel = useContext(OrdersContext);
	const [selectedOrder, setSelectedOrder] = useState<string | undefined>();

	const selectOrder = (orderId: string) => {
		setSelectedOrder(selectedOrder === orderId ? undefined : orderId);
	};

	const orders = ordersViewModel.orders;

	return (
		<OrdersListView
			orders={orders}
			selectOrder={selectOrder}
			selectedOrderID={selectedOrder}
		/>
	);
});

export default OrdersList;
