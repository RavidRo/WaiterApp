import React, {LegacyRef} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import OrdersListController from '../Controllers/OrdersListController';
import MapMarkersController from '../Controllers/MapMarkersController';

type MapScreenViewProps = {
	openBottomSheet: () => void;
	refBottomSheet: LegacyRef<RBSheet> | undefined;
};
export default function MapScreenView(props: MapScreenViewProps): JSX.Element {
	return (
		<>
			<View style={styles.screen} testID='homeScreen'>
				<MapMarkersController style={styles.map} />
				<TouchableOpacity
					style={styles.openDrawerButton}
					onPress={props.openBottomSheet}>
					<Text style={styles.openDrawerButtonText}>Your Orders</Text>
				</TouchableOpacity>
				<RBSheet
					ref={props.refBottomSheet}
					closeOnDragDown={true}
					closeOnPressMask={false}
					dragFromTopOnly={false}
					height={550}
					customStyles={{
						wrapper: {
							backgroundColor: 'transparent',
						},
						draggableIcon: {
							backgroundColor: '#000',
						},
						container: {
							backgroundColor: '#dfeef5',
						},
					}}>
					<OrdersListController />
				</RBSheet>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	screen: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		flex: 1,
	},
	map: {
		flexGrow: 1,
	},
	openDrawerButton: {
		borderTopColor: '#9fb7c9',
		borderTopWidth: 1,
		padding: 10,
		paddingBottom: 20,
		backgroundColor: '#99cbf2',
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
	},
	openDrawerButtonText: {
		fontSize: 18,
	},
});
