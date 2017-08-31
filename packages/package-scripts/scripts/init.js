'use strict'

const execa = require('execa')
const format = require('create-package-utils/format')
const fs = require('fs-extra')
const Listr = require('listr')
const path = require('path')
const paths = require('create-package-utils/paths')

const ownRoot = path.resolve(__dirname, '..')
const templatePath = path.join(ownRoot, 'template')
const readmeExists = fs.existsSync(path.join(paths.root, 'Readme.md'))

function init(projectRoot, packageName, originalDirectory, useYarn) {
	return new Listr([
		{
			title: 'Installing babel-runtime',
			task: () =>
				useYarn
					? execa('yarn', ['add', '--exact', 'babel-runtime'])
					: execa('npm', [
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
						publish: 'package-scripts publish',
						test: 'package-scripts test --watch',
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
					test: useYarn ? 'yarn test' : 'npm test',
					build: useYarn ? 'yarn build' : 'npm run build',
					check: useYarn ? 'yarn run check' : 'npm run check',
					cd: 'cd ' + relativePath,
				}

				context.log = format`
					Successfully created "{green ${packageName}}" at ${paths.root}
					Inside that directory, you can run several commands:

					{cyan ${commands.test}}
					  Starts the test runner.

					{cyan ${commands.build}}
					  Builds your package.

					{cyan ${commands.check}}
					  Typechecks and lints your code.

					We suggest that you begin by typing:
					  $ {cyan ${commands.cd}}
					  $ {cyan ${commands.test}}

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
