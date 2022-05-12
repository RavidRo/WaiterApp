import {isLocation, isOrder, isOrderStatus, isString} from '../typeGuards';
import OrderViewModel from '../ViewModel/OrderViewModel';

type Params = {[param: string]: unknown};
export default class Notifications {
	private orders: OrderViewModel;
	public eventToCallback: Record<string, (params: Params) => void> = {
		updateGuestLocation: params => this.updateGuestLocation(params),
		changeOrderStatus: params => this.changeOrderStatus(params),
		assignedToOrder: params => this.assignedToOrder(params),
	};

	constructor(orderViewModel: OrderViewModel) {
		this.orders = orderViewModel;
	}

	private assignedToOrder(params: Params): void {
		const order = params.order;
		if (isOrder(order)) {
			this.orders.assignedToOrder(order);
			return;
		}

		console.warn(
			'In the event, "assignedToOrder", parameters are not in the right format',
			params
		);
	}

	private updateGuestLocation(params: Params): void {
		const guestID = params.guestID;
		const guestLocation = params.location;
		if (isString(guestID) && isLocation(guestLocation)) {
			this.orders.updateGuestLocation(guestID, guestLocation);
			return;
		}

		console.warn(
			'In the event, "updateGuestLocation", parameters are not in the right format',
			params
		);
	}

	private changeOrderStatus(params: Params): void {
		const orderID = params.orderID;
		const status = params.orderStatus;
		if (isString(orderID) && isOrderStatus(status)) {
			this.orders.updateOrderStatus(orderID, status);
			return;
		}

		console.warn(
			'In the event, "changeOrderStatus", parameters are not in the right format',
			params
		);
	}
}
