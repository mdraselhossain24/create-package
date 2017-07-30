'use strict'

const chalk = require('chalk')

function format() {
	const args = Array.from(arguments)
	const strings = args[0]
	const values = args.slice(1)

	const string = values.reduce((acc, value, index) => {
		return acc + value + strings[index + 1]
	}, strings[0])

	const match = strings.join('').match(/^[ \t]*(?=\S)/gm)

	if (!match) {
		return string
	}

	const indent = Math.min.apply(Math, match.map(line => line.length))
	const regex = new RegExp(`^[ \\t]{${indent}}`, 'gm')

	const dedentedString = indent > 0 ? string.replace(regex, '') : string
	const chalkStrings = [dedentedString.trim()]
	chalkStrings.raw = chalkStrings

	return chalk(chalkStrings)
}

module.exports = format
