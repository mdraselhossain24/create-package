'use strict'

const format = require('create-package-utils/format')
const fs = require('fs-extra')

function checkProjectDirectory(projectRoot) {
	const validFiles = [
		'.DS_Store',
		'.git',
		'.gitignore',
		'.hg',
		'.hgcheck',
		'.hgignore',
		'LICENSE',
		'README.md',
		'Thumbs.db',
		'web.iml',
	]

	return fs
		.mkdirs(projectRoot)
		.then(() => fs.readdir(projectRoot))
		.then(files => {
			const safeDir = files.every(file => validFiles.indexOf(file) !== -1)

			if (!safeDir) {
				throw new Error(format`
					The directory "{red ${projectRoot}}" contains files that could conflict.
					Please use a different path or rename the current directory.
				`)
			}
		})
}

module.exports = checkProjectDirectory
