module.exports = {
	preset: 'react-native',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	transformIgnorePatterns: [
		'node_modules/(?!(react-native' +
			'|react-native-raw-bottom-sheet' +
			'|@react-native' +
			'|react-native-geolocation-service' +
			')/)',
	],
	moduleNameMapper: {
		'react-dom': 'react-native',
	},
	testMatch: [
		'**/__tests__/**/Test*.[jt]s?(x)',
		'**/?(*.)+(spec|test).[jt]s?(x)',
	],
};
