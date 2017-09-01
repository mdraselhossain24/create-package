'use strict'

const fs = require('fs')
const path = require('path')
const shell = require('shelljs')

shell.set('-e')
shell.set('-v')

const rootPath = path.join(__dirname, '..')
const packagesPath = path.join(rootPath, 'packages')
const packageNames = shell.ls(packagesPath)
const packageName = 'package-scripts'

const packageJSONPath = path.join(packagesPath, packageName, 'package.json')

console.log('loading ' + packageJSONPath)

const packageJSON = require(packageJSONPath)

if ('dependencies' in packageJSON) {
	for (const name of packageNames) {
		if (name in packageJSON.dependencies) {
			const packagePath = 'file:' + path.join(packagesPath, name)
			console.log(`replace ${name} with ${packagePath}`)
			packageJSON.dependencies[name] = packagePath
		}
	}

	console.log('writing ' + packageJSONPath)

	fs.writeFileSync(
		packageJSONPath,
		JSON.stringify(packageJSON, null, 2),
		'utf8'
	)
} else {
	console.log('skipping ' + packageName)
}
