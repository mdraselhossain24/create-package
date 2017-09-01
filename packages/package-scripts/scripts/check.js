'use strict'

const env = require('create-package-utils/env')
const execa = require('execa')
const format = require('create-package-utils/format')
const Listr = require('listr')
const paths = require('create-package-utils/paths')
const resolveFrom = require('resolve-from')

const task = new Listr(
	[
		{
			title: 'Checking environment',
			task: env.check,
		},
		{
			title: 'ESLint',
			task: () => {
				const config = require.resolve('eslint-config-create-package')

				return execa('eslint', [
					'--config',
					config,
					'--ignore-pattern',
					'/lib/',
					'--ignore-pattern',
					'/es/',
					'--ignore-pattern',
					'/dist/',
					'--ignore-pattern',
					'/flow-typed/',
					'--no-eslintrc',
					'--color',
					paths.root,
				]).catch(error => {
					throw new Error(format`
						ESLint failed:

						${error.stdout.trim()}
					`)
				})
			},
		},
		{
			title: 'Flow',
			enabled: () => env.features.flow,
			task: () => {
				const flow = require(resolveFrom(paths.root, 'flow-bin'))

				return execa(flow, [
					'check',
					'--color',
					'always',
					paths.root,
				]).catch(error => {
					throw new Error(format`
						Flow failed:

						${error.stdout.trim()}
					`)
				})
			},
		},
		{
			title: 'TSLint',
			enabled: () => false,
			task: () => {
				const config = require.resolve('tslint-config-create-package')

				return execa('tslint', [
					'--config',
					config,
					'--exclude',
					paths.lib,
					'--exclude',
					paths.es,
					'--exclude',
					paths.dist,
					// '--color',
					paths.root,
				]).catch(error => {
					throw new Error(format`
						TSLint failed:

						${error.stdout.trim()}
					`)
				})
			},
		},
		{
			title: 'TypeScript',
			enabled: () => env.features.ts,
			task: () => {
				return execa('tsc', ['--noEmit', '--pretty']).catch(error => {
					throw new Error(format`
						TypeScript failed:

						${error.stdout.trim()}
					`)
				})
			},
		},
	],
	{
		concurrent: true,
		exitOnError: false,
	}
)

task
	.run()
	.then(context => {
		if (context.log) {
			console.log()
			console.log(context.log)
		}
	})
	.catch(result => {
		for (const error of result.errors) {
			console.log()
			console.log(error.message)
		}
	})
