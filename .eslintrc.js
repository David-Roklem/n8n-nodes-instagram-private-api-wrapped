module.exports = {
	root: true,
	env: {
		browser: true,
		es6: true,
		node: true,
		jest: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: ['tsconfig.json'],
		sourceType: 'module',
		extraFileExtensions: ['.json'],
	},
	plugins: ['@typescript-eslint'],
	extends: [
		'eslint:recommended',
	],
	rules: {
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'no-unused-vars': 'off',
	},
	ignorePatterns: ['dist/', 'node_modules/', '*.js', 'src/test/**/*'],
};