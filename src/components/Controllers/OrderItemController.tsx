import {observer} from 'mobx-react-lite';
import React, {useContext} from 'react';
import {Alert} from 'react-native';
import {OrdersContext} from '../../contexts';
import {useAsync} from '../../hooks/useAsync';
import {wrapCatch} from '../../utils';
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

	const {call: deliver, loading: loadingDelivering} = useAsync(
		wrapCatch(ordersViewModel.deliver, e => Alert.alert(e))
	);
	const {call: onTheWay, loading: loadingOnTheWay} = useAsync(
		wrapCatch(ordersViewModel.onTheWay, e => Alert.alert(e))
	);
	const {call: fetchGuestDetails, loading: loadingGuest} = useAsync(
		(guestID: string) =>
			ordersViewModel
				.fetchGuestsDetails([guestID])
				.catch(e => Alert.alert(e))
	);

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
			loading={loadingDelivering || loadingOnTheWay}
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
