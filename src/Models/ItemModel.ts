import {makeAutoObservable} from 'mobx';
import {ItemIDO} from '../types/ido';

export default class ItemsModel {
	private _items: ItemIDO[];
	constructor() {
		this._items = [];
		makeAutoObservable(this);
	}

	get items() {
		return this._items;
	}

	set items(newItems: ItemIDO[]) {
		this._items = newItems;
	}
}
