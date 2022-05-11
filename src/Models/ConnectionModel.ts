import {makeAutoObservable} from 'mobx';

export default class ConnectionModel {
	private _token: string | undefined;
	private _isReconnecting: boolean;
	private _name: string | undefined;

	private constructor() {
		this._isReconnecting = false;
		makeAutoObservable(this);
	}

	private static instance?: ConnectionModel;
	public static getInstance(): ConnectionModel {
		if (!this.instance) {
			this.instance = new ConnectionModel();
		}
		return this.instance;
	}

	set token(newToken: string | undefined) {
		this._token = newToken;
	}

	get token(): string | undefined {
		return this._token;
	}

	set name(newName: string | undefined) {
		this._name = newName;
	}

	get name(): string | undefined {
		return this._name;
	}

	set isReconnecting(value: boolean) {
		this._isReconnecting = value;
	}

	get isReconnecting() {
		return this._isReconnecting;
	}
}
