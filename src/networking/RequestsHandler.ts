import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import configuration from '../../configuration.json';
import ConnectionModel from '../Models/ConnectionModel';
import {isString} from '../typeGuards';

class RequestsHandler {
	private axiosInstance: AxiosInstance;
	private connection: ConnectionModel;

	constructor() {
		this.connection = ConnectionModel.getInstance();
		this.axiosInstance = axios.create({
			baseURL: configuration['server-url'],
		});
	}

	private request<T>(
		endPoint: string,
		params: Record<string, unknown>,
		GET = true
	) {
		const config: AxiosRequestConfig = {
			headers: {
				...(this.connection.token && {
					Authorization: this.connection.token,
				}),
			},
		};
		console.info(`Request<${endPoint}>`, params);

		const request = GET ? this.axiosInstance.get : this.axiosInstance.post;
		return request(
			`${endPoint}`,
			GET ? {params, ...config} : params,
			config
		)
			.then(response => this.handleResponse<T>(response, endPoint))
			.catch(error => {
				if (error.response) {
					// The request was made and the server responded with a status code
					// that falls out of the range of 2xx

					if (error.response.status === 401) {
						//Unauthorized
						this.connection.token = undefined;
					}

					const rawMsg = error?.response?.data;
					console.warn(
						`Request<${endPoint},${error.response.status}>`,
						rawMsg ?? error
					);
					if (!rawMsg) {
						console.error(error.response.data);
						console.error(error.response.status);
						console.error(error.response.headers);
					}
					const msg = isString(rawMsg)
						? rawMsg
						: 'An unknown error has been received from the server';
					return Promise.reject(msg);
				} else if (error.request) {
					// The request was made but no response was received
					// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
					// http.ClientRequest in node.js
					console.warn(`Request<${endPoint}>`, error.request);
					return Promise.reject(
						'Could not receive a response from the server'
					);
				} else {
					// Something happened in setting up the request that triggered an Error
					console.warn(`Request<${endPoint}>`, error.message);
					return Promise.reject(
						'There was a problem in sending the request'
					);
				}
			});
	}

	private handleResponse<T>(response: AxiosResponse<T>, endPoint: string) {
		const data = response.data;
		console.info(`Response<${endPoint} , ${response.status}>:`, data);
		return data;
	}

	public post<T>(endPoint: string, params = {}) {
		return this.request<T>(endPoint, params, false);
	}

	public get<T>(endPoint: string, params = {}) {
		return this.request<T>(endPoint, params);
	}
}

export default RequestsHandler;
