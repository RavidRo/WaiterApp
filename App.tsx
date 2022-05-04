/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import ApproveLocation from './src/components/ApproveLocation';
import ConnectController from './src/components/Controllers/ConnectController';
import MapScreenController from './src/components/Controllers/MapScreenController';

const App = () => {
	return (
		<ConnectController>
			<ApproveLocation>
				<MapScreenController />
			</ApproveLocation>
		</ConnectController>
	);
};

export default App;
