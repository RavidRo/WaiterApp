module.exports = {
	root: true,
	extends: ['@react-native-community'],
	// extends: ['@react-native-community', 'prettier'],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	overrides: [
		{
			files: ['*.ts', '*.tsx'],
			rules: {
				'no-shadow': 'off',
				'@typescript-eslint/no-shadow': ['warn'],
				'no-unused-vars': 'off',
				'@typescript-eslint/no-unused-vars': [
					'warn',
					{
						argsIgnorePattern: '^_',
						varsIgnorePattern: '^_',
						caughtErrorsIgnorePattern: '^_',
					},
				],
				'no-undef': 'off',
				// 		semi: ['warn', 'always', {omitLastInOneLineBlock: true}],
				// 		indent: ['warn', 'tab', {SwitchCase: 1}],
				// 		quotes: ['warn', 'single', {avoidEscape: true}],
				// 		'jsx-quotes': ['warn', 'prefer-single'],
			},
			//
			// global: {
			// 	jest: 'readonly',
			// },
		},
	],
};

// module.exports = {
// 	},
// 	globals: {
// 		jest: 'readonly',
// 	},
// };
