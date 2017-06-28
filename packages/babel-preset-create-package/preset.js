'use strict'

const env = require('create-package-utils/env')
const semver = require('semver')

// TODO: This is so hacky that I am ashamed that I couldn't find a better
// solution how to get the lowest possible version from a version range.
// We can remove this when https://github.com/babel/babel-preset-env/pull/114
// got merged into babel-preset-env.
function getLowestNodeVersion(range) {
	let version = '0.0.0'
	for (let counter = 0; counter <= 150; counter++) {
		if (semver.satisfies(version, range)) {
			return version
		}

		version = semver.inc(version, counter % 10 ? 'minor' : 'major')
	}

	return version
}

function createPreset(context, opts) {
	const options = opts === undefined ? {} : opts

	const targets = {}

	if (env.isWebProject) {
		targets.browsers = env.supportedBrowsers
	}

	if (env.isNodeProject) {
		targets.node = getLowestNodeVersion(env.supportedNodes)
	}

	/**
	 * Presets
	 */

	const presets = [
		[
			require.resolve('babel-preset-env'),
			{
				modules: options.modules,
				targets,
			},
		],
	]

	if (env.isFlowProject) {
		presets.push(require.resolve('babel-preset-flow'))
	}

	/**
	 * Plugins
	 */

	const plugins = [
		require.resolve('babel-plugin-transform-class-properties'),
		require.resolve('babel-plugin-transform-object-rest-spread'),
		[
			require.resolve('babel-plugin-transform-runtime'),
			{
				helpers: false,
				polyfill: false,
				regenerator: true,
			},
		],
	]

	if (env.isReactProject) {
		plugins.push(
			require.resolve('babel-plugin-transform-react-jsx'),
			require.resolve('babel-plugin-syntax-jsx'),
			require.resolve('babel-plugin-transform-react-display-name')
		)

		if (!options.production) {
			plugins.push(
				require.resolve('babel-plugin-transform-react-jsx-source'),
				require.resolve('babel-plugin-transform-react-jsx-self')
			)
		}
	}

	if (options.modules !== false) {
		plugins.push(require.resolve('babel-plugin-dynamic-import-node'))
	} else {
		// babel-plugin-dynamic-import-node already includes syntax support
		plugins.push(require.resolve('babel-plugin-syntax-dynamic-import'))
	}

	return {
		presets,
		plugins,
	}
}

module.exports = createPreset
