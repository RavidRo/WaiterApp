import {observer} from 'mobx-react-lite';
import {ConnectionContext} from '../../contexts';
import React, {useContext, useState} from 'react';
import {Alert} from 'react-native';
import ConnectView from '../Views/ConnectView';

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
	const [username, setUsername] = useState('');

	const establishConnection = () => {
		setIsLoading(true);
		connectionViewModel
			.connect()
			.then(() => setIsConnected(true))
			.catch(e => {
				Alert.alert("Can't establish connection to server");
				console.warn(e);
			})
			.finally(() => setIsLoading(false));
	};

	const logIn = () => {
		setIsLoading(true);
		return connectionViewModel
			.login(username, password)
			.finally(() => setIsLoading(false));
	};

	const onSubmit = () => {
		logIn()
			.then(establishConnection)
			.catch(e => Alert.alert(e));
	};

	return (
		<ConnectView
			loggedIn={isLoggedIn}
			isLoading={isLoading}
			isConnected={isConnected}
			password={password}
			onPasswordChange={setPassword}
			username={username}
			onUsernameChange={setUsername}
			onSubmit={onSubmit}
			establishConnection={establishConnection}
			isReconnecting={connectionViewModel.connection.isReconnecting}>
			{props.children}
		</ConnectView>
	);
});
export default ConnectController;
