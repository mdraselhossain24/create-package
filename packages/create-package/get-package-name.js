'use strict'

const createTemporaryDirectory = require('./create-temporary-directory')
const extractStream = require('./extract-stream')
const fs = require('fs-extra')
const hyperquest = require('hyperquest')
const path = require('path')

function getPackageName(packageScripts) {
	if (packageScripts.includes('.tgz')) {
		const stream = (() => {
			if (packageScripts.startsWith('http')) {
				return hyperquest(packageScripts)
			} else {
				return fs.createReadStream(packageScripts)
			}
		})()

		return createTemporaryDirectory()
			.then(tmpdir => extractStream(stream, tmpdir))
			.then(tmpdir => {
				const pkg = require(path.join(tmpdir, 'package.json'))
				return pkg.name
			})
	} else if (packageScripts.startsWith('git+')) {
		// Pull package name out of git urls e.g:
		// git+mycompany/react-scripts.git
		// git+ssh://github.com/mycompany/react-scripts.git#v1.2.3
		return Promise.resolve(packageScripts.match(/([^/]+)\.git(#.*)?$/)[1])
	} else if (packageScripts.match(/.+@/)) {
		// Do not match @scope/ when stripping off @version or @tag
		return Promise.resolve(
			packageScripts.charAt(0) + packageScripts.substr(1).split('@')[0]
		)
	}
	return Promise.resolve(packageScripts)
}

module.exports = getPackageName
