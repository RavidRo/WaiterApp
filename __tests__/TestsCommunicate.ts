import Communicate from '../src/communication/Communicate';
import {Location} from '../src/types/ido';

const mockSend = jest.fn();
jest.mock('../src/communication/ConnectionHandler', () => {
	return jest.fn().mockImplementation(() => {
		return {
			send: mockSend,
		};
	});
});

import ConnectionHandler from '../src/communication/ConnectionHandler';
import Notifications from '../src/communication/Notifications';
import {ItemViewModel} from '../src/ViewModel/ItemViewModel';
import OrderViewModel from '../src/ViewModel/OrderViewModel';
import Requests from '../src/networking/Requests';

beforeEach(() => {
	(ConnectionHandler as unknown as jest.Mock).mockClear();
	mockSend.mockClear();
});

const location: Location = {
	x: 12.5,
	y: -29.12,
	mapID: '',
};
const newCommunicate = () => {
	const requests = new Requests();
	return new Communicate(
		new ConnectionHandler(
			new Notifications(
				new OrderViewModel(requests, new ItemViewModel(requests))
			)
		)
	);
};
describe('Sending notifications successfully', () => {
	it('updateWaiterLocation', () => {
		const communicate = newCommunicate();
		communicate.updateWaiterLocation(location);
		expect(mockSend).toBeCalledWith('updateWaiterLocation', {location});
	});
});
