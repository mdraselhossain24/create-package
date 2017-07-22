'use strict'

const babel = require('./utils/babel')
const chalk = require('chalk')
const env = require('create-package-utils/env')
const format = require('create-package-utils/format')
const fs = require('fs-extra')
const globby = require('globby')
const Listr = require('listr')
const paths = require('create-package-utils/paths')
const rollup = require('./utils/rollup')
const typescript = require('./utils/typescript')

const esmConfig = {
	presets: [
		[
			require.resolve('babel-preset-create-package'),
			{
				modules: false,
			},
		],
	],
}

const cjsConfig = {
	presets: [
		[
			require.resolve('babel-preset-create-package'),
			{
				modules: 'commonjs',
			},
		],
	],
}

const task = new Listr([
	{
		title: 'Checking environment',
		task: env.check,
	},
	{
		title: 'Checking files',
		task: () => {
			if (env.targets.web) {
				const entryExists =
					fs.existsSync(paths.index.js) ||
					fs.existsSync(paths.index.ts) ||
					fs.existsSync(paths.index.tsx)

				if (!entryExists) {
					throw new Error(
						'You need to have an index file as entry point for the UMD bundle.'
					)
				}
			}

			const tsFiles = globby.sync(['/**/*.{ts,tsx}'], {
				cwd: paths.src,
				root: paths.src,
				nodir: true,
			})
			if (tsFiles.length > 0 && !env.features.ts) {
				throw new Error(format`
					You have .ts files but TypeScript isn't installed.
					If you want to use TypeScript you need to install it and create a tsconfig.json.

					  $ {cyan npm install --save-dev typescript}
					  $ {cyan echo {} > tsconfig.json}
				`)
			}
		},
	},
	{
		title: 'Cleaning directory',
		task: () =>
			Promise.all([
				fs.remove(paths.lib),
				fs.remove(paths.es),
				fs.remove(paths.dist),
			]),
	},
	{
		title: 'Moving assets',
		task: () =>
			new Listr(
				[
					{
						title: 'to CommonJS directory',
						task: () =>
							fs.copy(paths.src, paths.lib, {
								filter: filterAssets,
							}),
					},
					{
						title: 'to ES Modules directory',
						enabled: () => env.targets.web,
						task: () =>
							fs.copy(paths.src, paths.es, {
								filter: filterAssets,
							}),
					},
				],
				{
					concurrent: true,
				}
			),
	},
	{
		title: 'Compiling JavaSript files',
		task: compileJS(paths.src),
	},
	{
		title: 'Compiling TypeSript files',
		enabled: () => env.features.ts,
		task: compileTS,
	},
	{
		title: 'Creating UMD bundle',
		enabled: () => env.targets.web,
		task: () =>
			new Listr([
				{
					title: 'Production',
					task: () =>
						rollup({
							minify: true,
						}),
				},
				{
					title: 'Development',
					task: () =>
						rollup({
							minify: false,
						}),
				},
			]),
	},
])

function filterAssets(filename) {
	return !/.(js|ts|tsx)$/.test(filename)
}

function compileJS(sourceDir) {
	return () =>
		new Listr(
			[
				{
					title: 'to CommonJS directory',
					task: () =>
						babel.transpileDir(sourceDir, paths.lib, cjsConfig),
				},
				{
					title: 'to ES Modules directory',
					enabled: () => env.targets.web,
					task: () =>
						babel.transpileDir(sourceDir, paths.es, esmConfig),
				},
			],
			{
				concurrent: true,
			}
		)
}

function compileTS() {
	return new Listr([
		{
			title: 'with TypeScript',
			task: () => {
				const ts = require('create-package-utils/typescript')
				const tsConfigCompilerOptions = typescript.readCompilerOptionsFromTSConfig(
					ts
				)
				const compilerOptions = Object.assign(
					{},
					tsConfigCompilerOptions,
					{
						target: 'es2015',
						module: 'es2015',
					}
				)
				return typescript.transpileDir(
					ts,
					paths.src,
					paths.compiled,
					compilerOptions
				)
			},
		},
		{
			title: 'with Babel',
			task: compileJS(paths.compiled),
		},
		{
			title: 'Cleaning up',
			task: () => fs.remove(paths.compiled),
		},
	])
}

task
	.run()
	.then(context => {
		if (context.log) {
			console.log()
			console.log(context.log)
		}
	})
	.catch(error => {
		console.log()
		console.log(error.message)
	})
