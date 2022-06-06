module.exports = {
	presets: ['module:metro-react-native-babel-preset'],
	/* This line was required by the Mobx installation steps:
		plugins: [['@babel/plugin-proposal-class-properties', {loose: false}]],
		https://mobx.js.org/installation.html

		but made a bug were prints and network requests wont work...

		The work around:
		https://github.com/mobxjs/mobx/issues/3100#issuecomment-962605244
	 */
	overrides: [
		{
			test: fileName => !fileName.includes('node_modules'),
			plugins: [
				[
					require('@babel/plugin-proposal-class-properties'),
					{loose: false},
				],
			],
		},
	],
};
