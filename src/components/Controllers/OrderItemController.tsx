import {observer} from 'mobx-react-lite';
import React, {useContext, useState} from 'react';
import {Alert} from 'react-native';
import {OrdersContext} from '../../contexts';
import Order from '../../Models/Order';
import OrderItemView from '../Views/OrderItemView';

type OrderItemControllerProps = {
	order: Order;
	selectedOrderID: string | undefined;
	evenItem: boolean;
	selectOrder: (string: string) => void;
};

export default observer(function OrderItemController(
	props: OrderItemControllerProps
) {
	const ordersViewModel = useContext(OrdersContext);
	const [loading, setLoading] = useState(false);
	const deliver = (orderID: string) => {
		setLoading(true);
		ordersViewModel
			.deliver(orderID)
			.finally(() => {
				setLoading(false);
			})
			.catch(e => {
				Alert.alert(e);
			});
	};
	const onTheWay = (orderID: string) => {
		setLoading(true);
		ordersViewModel
			.onTheWay(orderID)
			.finally(() => {
				setLoading(false);
			})
			.catch(e => {
				Alert.alert(e);
			});
	};
	return (
		<OrderItemView
			deliver={deliver}
			onTheWay={onTheWay}
			loading={loading}
			evenItem={props.evenItem}
			order={props.order}
			selectOrder={props.selectOrder}
			selected={props.selectedOrderID === props.order.id}
		/>
	);
});
