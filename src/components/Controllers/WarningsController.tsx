import {observer} from 'mobx-react-lite';
import React, {useContext} from 'react';
import {MyLocationContext, OrdersContext} from '../../contexts';
import WarningsView from '../Views/WarningsView';

const WarningsController = observer((): JSX.Element => {
	const myLocation = useContext(MyLocationContext);
	const orders = useContext(OrdersContext);

	const unavailableOrders = orders.unavailableOrders;
	const outOfBoundsOrders = orders.outOfBoundsOrders;
	const outOfBound = myLocation.isCurrentLocationOutOfBound;
	const currentLocationError = myLocation.currentLocationError;

	const warnings = [
		outOfBound ? "You're out side of the service area" : '',
		currentLocationError
			? `Could not get your location - ${currentLocationError}`
			: '',
		...unavailableOrders.map(
			order =>
				`Order - ${order.guestName ?? order.id.slice(0, 4)}: Guest's
				location is unavailable`
		),
		...outOfBoundsOrders.map(
			order =>
				`Order - ${
					order.guestName ?? order.id.slice(0, 4)
				}: Guest is out side of service area`
		),
	].filter(warn => warn !== '');

	if (warnings.length === 0) {
		return <></>;
	}

	return <WarningsView warnings={warnings} />;
});

export default WarningsController;
