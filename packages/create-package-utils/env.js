'use strict'

const browserslist = require('browserslist')
const format = require('./format')
const fs = require('fs-extra')
const paths = require('./paths')
const semver = require('semver')

const pkg = require(paths.pkg)
const useYarn = fs.existsSync(paths.yarnLock)

// We use the engines.node field in the package.json to check which node
// versions we need to support so we only transpile neccessary features.
const engines = pkg.engines || {}
const nodes = engines.node

// We use browserslist to check which browsers we need to support so we only
// transpile neccessary features. We also use this information to check if we
// need to create a UMD bundle and a transpiled es modules folder which is used
// by Rollup and WebPack.
const browsersListConfig = browserslist.findConfig(paths.root)
const browsers = browsersListConfig && browserslist(browsersListConfig.defaults)

const supported = {
	nodes,
	browsers,
}

// Targets
const targets = {
	node: Boolean(nodes),
	web: Boolean(browsers),
	universal: Boolean(nodes && browsers),
}

// Dependencies
const dependencies = pkg.dependencies || {}
const devDependencies = pkg.devDependencies || {}
const peerDependencies = pkg.peerDependencies || {}

// React
const react = 'react' in dependencies || 'react' in devDependencies

// TypeScript
const tsConfigExists = fs.existsSync(paths.tsConfig)
const tsInDependencies = 'typescript' in devDependencies
const ts = tsInDependencies && tsConfigExists

// Flow
const flowConfigExists = fs.existsSync(paths.flowConfig)
const flowInDependencies = 'flow-bin' in devDependencies
const flow = flowInDependencies && flowConfigExists

const features = {
	ts,
	flow,
	react,
}

function check() {
	// Targets
	if (targets.node && !semver.validRange(supported.nodes)) {
		throw new Error(format`
			The engines.node value in your package.json needs to be a valid version range.
		`)
	}

	if (!targets.node && !targets.web) {
		throw new Error(format`
			You need to have a engines.node field in your package.json or browserslist configured.
			This way we can change the build settings based on the environment you want to support.
			Configure browserslist if you want to support browsers or set the engines.node field if you want to support Node.
			You can also set both if you want to create a universal package.
		`)
	}

	// TypeScript
	if (tsConfigExists && !tsInDependencies) {
		throw new Error(format`
			You have a tsconfig.json but TypeScript is not installed.

			If you want to use TypeScript you need to install it.

			  $ {cyan npm install --save-dev typescript}

			If you don't want to use TypeScript remove the tsconfig.json.

			  $ {cyan rm tsconfig.json}
		`)
	}

	if (tsInDependencies && !tsConfigExists) {
		throw new Error(format`
			You have TypeScript installed but there is no tsconfig.json.

			If you want to use TypeScript you need to create a tsconfig.json.

			  $ {cyan touch tsconfig.json}

			If you don't want to use TypeScript uninstall it.

			  $ {cyan npm uninstall --save-dev typescript}
		`)
	}

	// Flow
	if (flowConfigExists && !flowInDependencies) {
		throw new Error(format`
			You have a .flowconfig but Flow is not installed.

			If you want to use Flow you need to install it.

			  $ {cyan npm install --save-dev flow-bin}

			If you don't want to use Flow remove the .flowconfig.

			  $ {cyan rm .flowconfig}
		`)
	}

	if (flowInDependencies && !flowConfigExists) {
		throw new Error(format`
			You have Flow installed but there is no .flowconfig.

			If you want to use Flow you need to create a .flowconfig.

			  $ {cyan touch .flowconfig}

			If you don't want to use Flow uninstall it.

			  $ {cyan npm uninstall --save-dev flow-bin}
		`)
	}
}

module.exports = {
	pkg,
	useYarn,
	supported,
	targets,
	dependencies,
	devDependencies,
	peerDependencies,
	features,
	check,
}
