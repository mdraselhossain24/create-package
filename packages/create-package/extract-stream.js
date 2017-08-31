'use strict'

const tar = require('tar-pack')

function extractStream(stream, destination) {
	return new Promise((resolve, reject) => {
		stream.pipe(
			tar.unpack(destination, error => {
				if (error) {
					reject(error)
				} else {
					resolve(destination)
				}
			})
		)
	})
}

module.exports = extractStream
