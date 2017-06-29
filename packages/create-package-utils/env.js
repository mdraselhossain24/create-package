'use strict'

const browserslist = require('browserslist')
const chalk = require('chalk')
const format = require('./format')
const fs = require('fs-extra')
const paths = require('./paths')
const semver = require('semver')

const pkg = require(paths.pkg)
const useYarn = fs.existsSync(paths.yarnLock)

// We use the engines.node field in the package.json to check which node
// versions we need to support so we only transpile neccessary features.
const engines = pkg.engines || {}
const supportedNodes = engines.node

// We use browserslist to check which browsers we need to support so we only
// transpile neccessary features. We also use this information to check if we
// need to create a UMD bundle and a transpiled es modules folder which is used
// by Rollup and WebPack.
const browsersListConfig = browserslist.findConfig(paths.root)
const supportedBrowsers =
	browsersListConfig && browserslist(browsersListConfig.defaults)

const isNodeProject = Boolean(supportedNodes)
const isWebProject = Boolean(supportedBrowsers)
const isUniversalProject = supportedNodes && supportedBrowsers

if (isNodeProject && !semver.validRange(supportedNodes)) {
	console.log(format`
		The engines.node value in your package.json needs to be a valid version range.
	`)
	process.exit(1)
}

if (!isNodeProject && !isWebProject) {
	console.log(format`
		You need to have a engines.node field in your package.json or browserslist configured.
		This way we can change the build settings based on the environment you want to support.
		Configure browserslist if you want to support browsers or set the engines.node field if you want to support Node.
		You can also set both if you want to create a universal package.
	`)

	process.exit(1)
}

// Dependencies

const dependencies = pkg.dependencies || {}
const devDependencies = pkg.devDependencies || {}
const peerDependencies = pkg.peerDependencies || {}

// React

const isReactProject = 'react' in devDependencies

// TypeScript

const tsConfigExists = fs.existsSync(paths.tsConfig)
const tsInDependencies = 'typescript' in devDependencies
const isTSProject = tsInDependencies && tsConfigExists

if (tsConfigExists && !tsInDependencies) {
	console.log(format`
		You have a tsconfig.json but TypeScript is not installed.

		If you want to use TypeScript you need to install it.

		  $ ${chalk.cyan('npm install --save-dev typescript')}

		If you don't want to use TypeScript remove the tsconfig.json.

		  $ ${chalk.cyan('rm tsconfig.json')}
	`)
	process.exit(1)
}

if (tsInDependencies && !tsConfigExists) {
	console.log(format`
		You have TypeScript installed but there is no tsconfig.json.

		If you want to use TypeScript you need to create a tsconfig.json.

		  $ ${chalk.cyan('echo {} > tsconfig.json')}

		If you don't want to use TypeScript uninstall it.

		  $ ${chalk.cyan('npm uninstall --save-dev typescript')}
	`)
	process.exit(1)
}

// Flow

const flowConfigExists = fs.existsSync(paths.flowConfig)
const flowInDependencies = 'flow-bin' in devDependencies
const isFlowProject = flowInDependencies && flowConfigExists

if (flowConfigExists && !flowInDependencies) {
	console.log(format`
		You have a .flowconfig but Flow is not installed.

		If you want to use Flow you need to install it.

		  $ ${chalk.cyan('npm install --save-dev flow-bin')}

		If you don't want to use Flow remove the .flowconfig.

		  $ ${chalk.cyan('rm .flowconfig')}
	`)
	process.exit(1)
}

if (flowInDependencies && !flowConfigExists) {
	console.log(format`
		You have Flow installed but there is no .flowconfig.

		If you want to use Flow you need to create a .flowconfig.

		  $ ${chalk.cyan('touch .flowconfig')}

		If you don't want to use Flow uninstall it.

		  $ ${chalk.cyan('npm uninstall --save-dev flow-bin')}
	`)
	process.exit(1)
}

module.exports = {
	pkg,
	useYarn,
	supportedNodes,
	supportedBrowsers,
	isNodeProject,
	isWebProject,
	isUniversalProject,
	dependencies,
	devDependencies,
	peerDependencies,
	isReactProject,
	isTSProject,
	isFlowProject,
}
