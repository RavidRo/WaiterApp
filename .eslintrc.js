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
				'@typescript-eslint/no-shadow': ['error'],
				'no-shadow': 'off',
				'no-undef': 'off',
				'@typescript-eslint/no-unused-vars': [
					'warn',
					{
						argsIgnorePattern: '^_',
						varsIgnorePattern: '^_',
						caughtErrorsIgnorePattern: '^_',
					},
				],
				// 		'no-unused-vars': 'off',
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
