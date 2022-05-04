import {observer} from 'mobx-react-lite';
import {ConnectionContext} from '../../contexts';
import React, {useContext, useState} from 'react';
import {Alert} from 'react-native';
import ConnectView from '../Views/ConnectView';
import {isString} from '../../typeGuards';

type ConnectControllerProps = {
	children: React.ReactNode;
};

const ConnectController = observer((props: ConnectControllerProps) => {
	const connectionViewModel = useContext(ConnectionContext);

	const token = connectionViewModel.connection.token;
	const isLoggedIn = token !== undefined;

	const [isConnected, setIsConnected] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [password, setPassword] = useState('');

	const establishConnection = () => {
		setIsLoading(true);
		connectionViewModel
			.connect()
			.then(() => setIsConnected(true))
			.catch(() => Alert.alert("Can't establish connection to server"))
			.finally(() => setIsLoading(false));
	};

	const logIn = () => {
		setIsLoading(true);
		return connectionViewModel
			.login(password)
			.finally(() => setIsLoading(false));
	};

	const onSubmit = () => {
		logIn()
			.then(establishConnection)
			.catch(e => {
				const rawMsg = e?.response?.data;
				const msg =
					rawMsg !== undefined && isString(rawMsg)
						? rawMsg
						: "Can't login to server";
				Alert.alert(msg);
			});
	};

	return (
		<ConnectView
			loggedIn={isLoggedIn}
			isLoading={isLoading}
			isConnected={isConnected}
			password={password}
			onPasswordChange={setPassword}
			onSubmit={onSubmit}
			establishConnection={establishConnection}
			isReconnecting={connectionViewModel.connection.isReconnecting}>
			{props.children}
		</ConnectView>
	);
});
export default ConnectController;
