'use strict'

const chalk = require('chalk')
const env = require('create-package-utils/env')
const format = require('create-package-utils/format')
const paths = require('create-package-utils/paths')

function getConfig() {
	env.check()

	const extensions = /* env.features.ts ? '{js,ts,tsx}' : */ '{js}'
	const moduleFileExtensions = /* env.features.ts
		? ['js', 'json', 'ts', 'tsx']
		:  */ [
		'js',
		'json',
	]

	const config = {
		moduleFileExtensions,
		collectCoverageFrom: [`src/**/*.${extensions}`],
		rootDir: paths.root,
		testEnvironment: env.targets.web ? 'jsdom' : 'node',
		testMatch: [
			`**/__tests__/**/*.${extensions}`,
			`**/test/**/*.${extensions}`,
			`**/?(*.)(spec|test).${extensions}`,
		],
		testPathIgnorePatterns: ['/node_modules/', '/lib/', '/es/', '/dist/'],
		transform: {
			'.js': require.resolve('./babel-jest'),
			// '.(ts|tsx)': require.resolve('./ts-jest'),
		},
	}

	const overrides = env.pkg.jest || {}
	const supportedKeys = [
		'collectCoverageFrom',
		'coverageReporters',
		'coverageThreshold',
		'snapshotSerializers',
	]

	const unsupportedKeys = Object.keys(overrides).filter(
		override => supportedKeys.indexOf(override) === -1
	)
	if (unsupportedKeys.length) {
		throw new Error(format`
			Out of the box, create-package only supports overriding these Jest options:

			${supportedKeys.map(key => `  - ${key}`).join('\n')}

			These options in your package.json Jest configuration aren't currently supported by create-package:

			${unsupportedKeys.map(key => `  - ${key}`).join('\n')}

			If you wish to override other Jest options, you need to eject from the default setup.
			You can do so by running:

			  $ ${chalk.cyan('npm run eject')}

			Remember that this is a one-way operation.
			Feel free to file an issue at create-package to discuss supporting more options out of the box.
		`)
	}
	return Object.assign({}, config, overrides)
}

module.exports = getConfig
