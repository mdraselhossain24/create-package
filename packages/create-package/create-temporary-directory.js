'use strict'

const tmp = require('tmp')

function createTemporaryDirectory() {
	return new Promise((resolve, reject) => {
		tmp.dir({ unsafeCleanup: true }, (error, tmpdir) => {
			if (error) {
				reject(error)
			} else {
				resolve(tmpdir)
			}
		})
	})
}

module.exports = createTemporaryDirectory
