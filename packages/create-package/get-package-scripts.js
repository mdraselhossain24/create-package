'use strict'

const semver = require('semver')

function getPackageScripts(packageScripts) {
	if (semver.valid(packageScripts)) {
		return `package-scripts@${packageScripts}`
	} else if (packageScripts) {
		// For tar.gz or alternative paths
		return packageScripts
	}

	return 'package-scripts'
}

module.exports = getPackageScripts
