'use strict'

const env = require('create-package-utils/env')
const format = require('create-package-utils/format')
const paths = require('create-package-utils/paths')

function getConfig() {
	env.check()

	const extensions = env.features.ts ? ['js', 'ts', 'tsx'] : ['js']
	const moduleFileExtensions = [...extensions, 'json']
	const globExtensions = '{' + extensions.join(', ') + '}'

	const config = {
		moduleFileExtensions,
		collectCoverageFrom: [`src/**/*.${globExtensions}`],
		rootDir: paths.root,
		testEnvironment: env.targets.web ? 'jsdom' : 'node',
		testMatch: [
			`**/__tests__/**/*.${globExtensions}`,
			`**/test/**/*.${globExtensions}`,
			`**/?(*.)(spec|test).${globExtensions}`,
		],
		testPathIgnorePatterns: ['/node_modules/', '/lib/', '/es/', '/dist/'],
		transform: {
			'.js': require.resolve('./babel-jest'),
			'.(ts|tsx)': require.resolve('./ts-jest'),
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

			Feel free to file an issue at create-package to discuss supporting more options out of the box.
		`)
	}
	return Object.assign({}, config, overrides)
}

module.exports = getConfig
