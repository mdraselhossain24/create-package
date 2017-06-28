const config = require('./packages/eslint-config-create-package/config')

module.exports = Object.assign({}, config, {
	parserOptions: {
		ecmaVersion: 2015,
		sourceType: 'script',
		ecmaFeatures: {
			impliedStrict: false,
		},
	},
	rules: Object.assign({}, config.rules, {
		strict: ['warn', 'global'],
		'import/no-commonjs': 'off',
	}),
})
