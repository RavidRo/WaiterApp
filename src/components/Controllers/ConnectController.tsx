import {observer} from 'mobx-react-lite';
import {ConnectionContext} from '../../contexts';
import React, {useContext, useState} from 'react';
import {Alert} from 'react-native';
import ConnectView from '../Views/ConnectView';
import {useAsync} from '../../hooks/useAsync';

type ConnectControllerProps = {
	children: React.ReactNode;
};

const ConnectController = observer((props: ConnectControllerProps) => {
	const connectionViewModel = useContext(ConnectionContext);

	const token = connectionViewModel.connection.token;
	const isLoggedIn = token !== undefined;

	const [isConnected, setIsConnected] = useState(false);
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');

	const {call: establishConnection, loading: isEstablishingConnection} =
		useAsync(() =>
			connectionViewModel
				.connect()
				.then(() => setIsConnected(true))
				.catch(e => {
					Alert.alert("Can't establish connection to server");
					console.warn(e);
				})
		);

	const {call: logIn, loading: isLoggingIn} = useAsync(() =>
		connectionViewModel.login(username, password)
	);

	const onSubmit = () => {
		logIn()
			.then(establishConnection)
			.catch(e => Alert.alert(e));
	};

	return (
		<ConnectView
			loggedIn={isLoggedIn}
			isLoading={isEstablishingConnection || isLoggingIn}
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
