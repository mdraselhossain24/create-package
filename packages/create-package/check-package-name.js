'use strict'

const checkPackageAvailable = require('npm-name')
const format = require('create-package-utils/format')
const Listr = require('listr')
const validatePackageName = require('validate-npm-package-name')

function checkPackageName(packageName) {
	return new Listr([
		{
			title: 'Validating npm naming convention',
			task: () => {
				const packageValid = validatePackageName(packageName)
				if (!packageValid.validForNewPackages) {
					const errors = packageValid.errors || []
					const warnings = packageValid.warnings || []

					const errorList = errors
						.concat(warnings)
						.map(error => `  -  ${error}`)
						.join('\n')

					throw new Error(format`
						Could not create a package called "{red ${packageName}}" because of npm naming restrictions:

						${errorList}
					`)
				}
			},
		},
		{
			title: 'Checking availability',
			task: () =>
				checkPackageAvailable(packageName).then(available => {
					if (!available) {
						throw new Error(format`
							The package name "{red ${packageName}}" is already taken.
							This means you can't publish this package to npm.
							Please choose another package name :)
						`)
					}
				}),
		},
	])
}

module.exports = checkPackageName
