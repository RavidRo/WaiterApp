import {observer} from 'mobx-react-lite';
import React, {useCallback, useContext, useEffect} from 'react';
import {Alert, Button} from 'react-native';
import {MyLocationContext} from '../../contexts';

type ApproveLocationProps = {
	children: React.ReactNode;
};

const ApproveLocation = observer((props: ApproveLocationProps) => {
	const myLocationViewModel = useContext(MyLocationContext);
	const approved = myLocationViewModel.locationApproved;

	const askApproval = useCallback(
		() =>
			myLocationViewModel
				.askLocationApproval()
				.catch(e => Alert.alert(e)),
		[myLocationViewModel]
	);

	useEffect(() => {
		askApproval();
	}, [askApproval]);

	return (
		<>
			{approved || (
				<Button
					onPress={() => askApproval()}
					title='Approve Location Services'
				/>
			)}
			{props.children}
		</>
	);
});

export default ApproveLocation;
