'use strict'

const path = require('path')
const shell = require('shelljs')

shell.set('-e')
shell.set('-v')

const rootPath = path.join(__dirname, '..')
const packagesPath = path.join(rootPath, 'packages')
const packageScriptsPath = path.join(packagesPath, 'package-scripts')
const createPackagePath = path.join(
	packagesPath,
	'create-package',
	'create-package.js'
)

shell.cd(rootPath)
shell.exec('node_modules/.bin/lerna bootstrap')

shell.cd(packageScriptsPath)
shell.cp('package.json', 'package.json.orig')

shell.cd(__dirname)
shell.exec('node replace-local-dependencies')

const npmPackOutput = shell.exec('npm pack ' + packageScriptsPath, {
	cwd: packageScriptsPath,
})
const bundlePath = path.join(packageScriptsPath, npmPackOutput.stdout.trim())

shell.exec('yarn cache clean')

shell.exec(
	`node ${createPackagePath} create-package-test --package-scripts ${bundlePath} --debug`,
	{ cwd: rootPath }
)

shell.cd(packageScriptsPath)
shell.rm('package.json')
shell.mv('package.json.orig', 'package.json')

shell.rm(bundlePath)
