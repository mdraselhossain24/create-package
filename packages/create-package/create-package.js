#!/usr/bin/env node

'use strict'

const chalk = require('chalk')
const checkPackageName = require('./check-package-name')
const checkProjectDirectory = require('./check-project-directory')
const execa = require('execa')
const format = require('create-package-utils/format')
const Listr = require('listr')
const meow = require('meow')
const path = require('path')
const updateNotifier = require('update-notifier')

const cli = meow(`
	Usage
	  $ ${chalk.cyan('create-package <package-name>')}

	Examples
	  $ ${chalk.cyan('create-package my-awesome-package')}

	If you have any problems, do not hesitate to file an issue:
	${chalk.cyan('https://githup.com/k15a/create-package/issues/new')}

	Keep smiling 😊  and stay awesome! 🌈
`)

const useYarn = (() => {
	try {
		execa.sync('yarnpkg', ['--version'], { stdio: 'ignore' })
		return true
	} catch (error) {
		return false
	}
})()

const projectPath = cli.input[0]

if (typeof projectPath === 'undefined') {
	console.log(format`
		Please specify the package name:
		  $ ${chalk.cyan('create-package <package-name>')}

		For example:
		  $ ${chalk.cyan('create-package my-awesome-package')}
		  $ ${chalk.cyan('create-package packages/my-awesome-package')}

		Run "create-package --help" to see all options.
	`)
	process.exit(1)
}

const originalDirectory = process.cwd()
const projectRoot = path.resolve(projectPath)
const packageName = path.basename(projectRoot)

const task = new Listr([
	{
		title: 'Checking package name',
		task: () => checkPackageName(packageName),
	},
	{
		title: 'Creating project directory',
		task: () =>
			checkProjectDirectory(projectRoot).then(() => {
				process.chdir(projectRoot)
			}),
	},
	{
		title: 'Creating package.json',
		enabled: () => useYarn,
		task: () => execa('yarn', ['init', '--yes'], { stdio: 'ignore' }),
	},
	{
		title: 'Creating package.json',
		enabled: () => !useYarn,
		task: () => execa('npm', ['init', '--yes'], { stdio: 'ignore' }),
	},
	{
		title: 'Installing dependencies',
		enabled: () => useYarn,
		task: () =>
			execa('yarn', ['add', '--dev', '--exact', 'package-scripts']),
	},
	{
		title: 'Installing package dependencies',
		enabled: () => !useYarn,
		task: () =>
			execa('npm', [
				'install',
				'--save-dev',
				'--save-exact',
				'package-scripts',
			]),
	},
	{
		title: 'Initializing project',
		task: () => {
			const scriptsPath = path.resolve(
				process.cwd(),
				'node_modules',
				'package-scripts',
				'scripts',
				'init.js'
			)

			const init = require(scriptsPath)
			return init(projectRoot, packageName, originalDirectory)
		},
	},
])

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

updateNotifier({
	pkg: cli.pkg,
}).notify()
