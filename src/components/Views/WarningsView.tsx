import {observer} from 'mobx-react-lite';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

type WarningsViewProps = {
	warnings: string[];
};

const WarningsView = observer((props: WarningsViewProps): JSX.Element => {
	if (props.warnings.length === 0) {
		return <></>;
	}

	return (
		<View style={styles.titleContainer}>
			{props.warnings.map(warning => (
				<Text>{'>' + warning}</Text>
			))}
		</View>
	);
});

export default WarningsView;

const styles = StyleSheet.create({
	titleContainer: {
		backgroundColor: '#f2da9960',
		padding: 10,
	},
	title: {
		fontSize: 16,
		fontFamily: 'Montserrat-Medium',
	},
});
