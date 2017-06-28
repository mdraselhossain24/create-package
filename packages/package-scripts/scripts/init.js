'use strict'

const chalk = require('chalk')
const format = require('create-package-utils/format')
const fs = require('fs-extra')
const execa = require('execa')
const Listr = require('listr')
const path = require('path')
const paths = require('create-package-utils/paths')

const ownRoot = path.join(__dirname, '..')
const templatePath = path.join(ownRoot, 'template')
const useYarn = fs.existsSync(path.join(paths.root, 'yarn.lock'))
const readmeExists = fs.existsSync(path.join(paths.root, 'Readme.md'))

function init(projectRoot, packageName, originalDirectory) {
	return new Listr([
		{
			title: 'Installing babel-runtime',
			enabled: () => useYarn,
			task: () => execa('yarn', ['add', '--exact', 'babel-runtime']),
		},
		{
			title: 'Installing babel-runtime',
			enabled: () => !useYarn,
			task: () =>
				execa('npm', [
					'install',
					'--save',
					'--save-exact',
					'babel-runtime',
				]),
		},
		{
			title: 'Updating package.json',
			task: () => {
				const pkg = require(paths.pkg)

				Object.assign(pkg, {
					scripts: {
						build: 'package-scripts build',
						check: 'package-scripts check',
						eject: 'package-scripts eject',
						publish: 'package-scripts publish',
						test: 'package-scripts test',
					},
					main: 'lib/index.js',
					module: 'es/index.js',
					keywords: ['create-package'],
					files: ['lib', 'dist', 'es', 'docs'],
					browserslist: ['last 2 versions'],
					engines: { node: '>= 4' },
				})

				return fs.writeFile(paths.pkg, JSON.stringify(pkg, null, '\t'))
			},
		},
		{
			title: 'Moving readme to Readme.old.md',
			enabled: () => readmeExists,
			task: () => {
				return fs.rename(
					path.join(paths.root, 'Readme.md'),
					path.join(paths.root, 'Readme.old.md')
				)
			},
		},
		{
			title: 'Copying template files',
			task: context => {
				const relativePath =
					path.relative(originalDirectory, paths.root) || '.'

				const commands = {
					test: chalk.cyan(useYarn ? 'yarn test' : 'npm test'),
					build: chalk.cyan(useYarn ? 'yarn build' : 'npm run build'),
					eject: chalk.cyan(useYarn ? 'yarn eject' : 'npm run eject'),
					check: chalk.cyan(
						useYarn ? 'yarn run check' : 'npm run check'
					),
					cd: chalk.cyan('cd ' + relativePath),
				}

				context.log = format`
					Successfully created "${chalk.green(packageName)}" at ${paths.root}
					Inside that directory, you can run several commands:

					${commands.test}
					  Starts the test runner.

					${commands.build}
					  Builds your package.

					${commands.eject}
					  Removes this tool and copies build dependencies, configuration files and scripts into the app directory.
					  If you do this, you can’t go back!

					${commands.check}
					  Typechecks and lints your code.

					We suggest that you begin by typing:
					  $ ${commands.cd}
					  $ ${commands.test}

					Please tell us what you're creating with create-package.
					Keep smiling 😊  and stay awesome! 🌈
				`

				return fs.copy(templatePath, paths.root).then(() => {
					// Rename gitignore after the fact to prevent npm from renaming it to .npmignore
					// See: https://github.com/npm/npm/issues/1862
					const gitignore = path.join(paths.root, 'gitignore')
					const dotGitignore = path.join(paths.root, '.gitignore')

					return fs.move(gitignore, dotGitignore).catch(error => {
						if (error.code === 'EEXIST') {
							return fs.readFileSync(gitignore).then(data => {
								return Promise.all([
									fs.appendFileSync(dotGitignore, data),
									fs.unlinkSync(gitignore),
								])
							})
						}

						throw error
					})
				})
			},
		},
	])
}

module.exports = init
