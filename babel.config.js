module.exports = {
	presets: ['module:metro-react-native-babel-preset'],
	/* This line was required by the Mobx installation steps:
		https://mobx.js.org/installation.html
		but made a bug were prints and network requests wont work
	 */
	// plugins: [['@babel/plugin-proposal-class-properties', {loose: false}]],
};
