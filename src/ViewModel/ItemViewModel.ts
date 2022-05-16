import {ItemIDO} from '../types/ido';
import ItemModel from '../Models/ItemModel';
import Requests from '../networking/Requests';

export class ItemViewModel {
	private itemsModel: ItemModel;
	private requests: Requests;

	constructor(requests: Requests) {
		this.itemsModel = new ItemModel();
		this.requests = requests;
	}

	get items(): ItemIDO[] {
		return this.itemsModel.items;
	}

	getItemByID(id: string): ItemIDO | undefined {
		return this.itemsModel.items.find(item => item.id === id);
	}

	syncItems(): Promise<void> {
		return this.requests.getItems().then(items => {
			this.itemsModel.items = items;
		});
	}
}
