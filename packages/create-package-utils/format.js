'use strict'

const chalk = require('chalk')

function format() {
	const args = Array.from(arguments)
	const string = chalk(args)
	const match = args[0].join('').match(/^[ \t]*(?=\S)/gm)

	if (!match) {
		return string
	}

	const indent = Math.min.apply(Math, match.map(line => line.length))
	const regex = new RegExp(`^[ \\t]{${indent}}`, 'gm')

	const dedentedString = indent > 0 ? string.replace(regex, '') : string

	return dedentedString.trim()
}

module.exports = format
