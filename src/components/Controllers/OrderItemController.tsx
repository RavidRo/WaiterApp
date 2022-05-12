import {observer} from 'mobx-react-lite';
import React, {useContext, useState} from 'react';
import {Alert} from 'react-native';
import {OrdersContext} from '../../contexts';
import {UIOrder} from '../../ViewModel/OrderViewModel';
import OrderItemView from '../Views/OrderItemView';

type OrderItemControllerProps = {
	order: UIOrder;
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

	const [loadingGuest, setLoadingGuest] = useState(false);
	const fetchGuestDetails = (guestID: string) => {
		setLoadingGuest(true);
		ordersViewModel
			.fetchGuestsDetails([guestID])
			.finally(() => {
				setLoadingGuest(false);
			})
			.catch(e => {
				Alert.alert(e);
			});
	};

	const dismissOrder = (orderID: string) => {
		ordersViewModel.dismissOrder(orderID);
	};

	const guestLocation = props.order.guestLocation;
	const isInBound = (n: Number) => n >= 0 && n <= 1;
	const locationOutOfBounds =
		guestLocation !== undefined &&
		(!isInBound(guestLocation.x) || !isInBound(guestLocation.y));

	return (
		<OrderItemView
			deliver={deliver}
			onTheWay={onTheWay}
			loading={loading}
			evenItem={props.evenItem}
			order={props.order}
			selectOrder={props.selectOrder}
			selected={props.selectedOrderID === props.order.id}
			dismissOrder={dismissOrder}
			unknownLocation={guestLocation === undefined}
			locationOutOfBounds={locationOutOfBounds}
			fetchGuestDetails={fetchGuestDetails}
			loadingGuest={loadingGuest}
			guestsDetailsAvailable={props.order.guestPhoneNumber !== undefined}
		/>
	);
});
