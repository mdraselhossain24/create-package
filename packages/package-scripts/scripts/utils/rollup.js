'use strict'

const babili = require('rollup-plugin-babili')
const chalk = require('chalk')
const commonjs = require('rollup-plugin-commonjs')
const env = require('create-package-utils/env')
const json = require('rollup-plugin-json')
const nodeResolve = require('rollup-plugin-node-resolve')
const pascalCase = require('pascal-case')
const path = require('path')
const paths = require('create-package-utils/paths')
const rollup = require('rollup')

function createBundle(options) {
	env.check()

	const entry = paths.index.es
	const extension = options.minify ? '.min.js' : '.js'
	const moduleName = pascalCase(env.pkg.name)
	const dest = path.join(paths.dist, `${env.pkg.name}${extension}`)

	const globals = {
		react: 'React',
		'react-dom': 'ReactDOM',
	}

	const plugins = [nodeResolve(), commonjs(), json()]

	if (options.minify) {
		plugins.push(babili())
	}

	return rollup
		.rollup({
			entry,
			plugins,
			onwarn: handleRollupWarnings,
			external: Object.keys(env.peerDependencies),
		})
		.then(bundle =>
			bundle.write({
				dest,
				globals,
				moduleName,
				sourceMap: true,
				format: 'umd',
				exports: 'named',
			})
		)
}

function handleRollupWarnings(warning) {
	console.warn(chalk.yellow(warning.message))
}

module.exports = createBundle
