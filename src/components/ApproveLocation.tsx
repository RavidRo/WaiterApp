import React, {useCallback, useContext, useEffect} from 'react';
import {PermissionsAndroid, Platform, Alert, Button} from 'react-native';
import {MyLocationContext} from '../contexts';

type ApproveLocationProps = {
	children: React.ReactNode;
};

export default function ApproveLocation(props: ApproveLocationProps) {
	const myLocationViewModel = useContext(MyLocationContext);

	const askApproval = useCallback(() => {
		const approvingLocationRequest =
			Platform.OS === 'android'
				? PermissionsAndroid.request(
						PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
				  )
				: Promise.reject('IOS is not supported');
		approvingLocationRequest
			.then(value => {
				if (value === 'granted') {
					myLocationViewModel.approve();
				} else {
					Alert.alert('Location needs to be approved');
				}
			})
			.catch(() => {
				Alert.alert('Location needs to be approved');
			});
	}, [myLocationViewModel]);

	useEffect(() => {
		askApproval();
	}, [askApproval]);

	return (
		<>
			<Button
				onPress={() => askApproval()}
				title='Approve Location Services'
			/>
			{props.children}
		</>
	);
}
