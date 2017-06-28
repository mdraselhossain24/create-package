'use strict'

const fs = require('fs-extra')
const path = require('path')

function write(filePath, content) {
	return fs
		.mkdirs(path.dirname(filePath))
		.then(() => fs.writeFile(filePath, content))
		.then(() => filePath)
}

module.exports = write
