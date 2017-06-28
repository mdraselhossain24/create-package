// @remove-file-on-eject

'use strict'

const chalk = require('chalk')
const execa = require('execa')
const format = require('create-package-utils/format')
const fs = require('fs-extra')
const globby = require('globby')
const Listr = require('listr')
const path = require('path')
const paths = require('create-package-utils/paths')
const promptly = require('promptly')
const write = require('create-package-utils/write')

const ownRoot = path.resolve(__dirname, '..')
const useYarn = fs.existsSync(path.join(paths.root, 'yarn.lock'))

const ownPackage = require(path.join(ownRoot, 'package.json'))
const ownDependencies = ownPackage.dependencies || {}

const files = globby.sync(['scripts/**/*'], {
	cwd: ownRoot,
	nodir: true,
})

function verifyAbsent(file) {
	return fs.pathExists(path.join(paths.root, file)).then(exists => {
		if (exists) {
			throw new Error(format`
				"${file}" already exists in your app folder.
				We cannot continue as you would lose all the changes in that file or directory.
				Please move or delete it (maybe make a copy for backup) and run this command again.
			`)
		}
	})
}

const task = new Listr([
	{
		title: 'Checking git status',
		enabled: () => false,
		task: () =>
			execa('git', ['status', '--porcelain'])
				.then(result => result.stdout.trim())
				.catch(() => '')
				.then(status => {
					if (status) {
						const statusMessage = status
							.split('\n')
							.map(line => '  ' + line.trim())
							.join('\n')

						throw new Error(format`
							This git repository has untracked files or uncommitted changes:

							${statusMessage}

							Remove untracked files, stash or commit any changes, and try again.
						`)
					}
				}),
	},
	{
		title: 'Checking files',
		task: () => Promise.all(files.map(verifyAbsent)),
	},
	{
		title: 'Copying files',
		task: () =>
			Promise.all(
				files.map(file =>
					fs
						.readFile(path.join(ownRoot, file), 'utf8')
						.then(content => {
							// Skip flagged files
							if (/\/\/\s*@remove-file-on-eject/.test(content)) {
								return null
							}

							return write(
								file.replace(ownRoot, paths.root),
								content
							)
						})
				)
			),
	},
	{
		title: 'Updating package.json',
		task: updatePackage,
	},
])

function updatePackage() {
	return new Listr([
		{
			title: 'Installing dependencies',
			task: () => {
				const dependencies = Object.keys(
					ownDependencies
				).map(dependency => {
					const version = ownDependencies[dependency]
					return `${dependency}@${version}`
				})

				return useYarn
					? execa('yarn', ['add', '--dev'].concat(dependencies))
					: execa('npm', ['install', '-D'].concat(dependencies))
			},
		},
		{
			title: 'Updating scripts',
			task: () => {
				const appPackage = require(path.join(
					paths.root,
					'package.json'
				))
				delete appPackage.scripts.eject

				const binRegex = /package-scripts (\w+)/

				for (const key of Object.keys(appPackage.scripts)) {
					const script = appPackage.scripts[key]
					if (binRegex.test(script)) {
						appPackage.scripts[key] = script.replace(
							binRegex,
							'node scripts/$1.js'
						)
					}
				}

				return write(
					path.join(paths.root, 'package.json'),
					JSON.stringify(appPackage, null, '\t')
				)
			},
		},
		{
			title: 'Uninstalling package-scripts',
			task: () =>
				useYarn
					? execa('yarn', ['remove', ownPackage.name])
					: execa('npm', [
							'uninstall',
							'--save-dev',
							ownPackage.name,
						]),
		},
	])
}

promptly
	.confirm(
		chalk.yellow(
			'Are you sure you want to eject? This action can not be undone! y/N'
		),
		{
			default: false,
		}
	)
	.then(answer => {
		if (answer) {
			return task.run()
		}

		throw new Error('Close one! Abort eject.')
	})
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
