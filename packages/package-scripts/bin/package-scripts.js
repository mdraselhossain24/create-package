#!/usr/bin/env node

'use strict'

const execa = require('execa')
const format = require('create-package-utils/format')

const script = process.argv[2]
const args = process.argv.slice(3)

switch (script) {
	case 'build':
	case 'check':
	case 'init':
	case 'publish':
	case 'test': {
		try {
			execa.sync(
				'node',
				[require.resolve('../scripts/' + script)].concat(args),
				{ stdio: 'inherit' }
			)
		} catch (error) {
			if (error.signal) {
				if (error.signal === 'SIGKILL') {
					console.log(format`
						The script failed because the process exited too early.
						This probably means the system ran out of memory
						or someone called "kill -9" on the process.
					`)
				} else if (error.signal === 'SIGTERM') {
					console.log(format`
						The script failed because the process exited too early.
						Someone might have called "kill" or "killall",
						or the system could be shutting down.
					`)
				}
				process.exit(1)
			}
			process.exit(error.status)
		}
		break
	}
	default:
		console.log(format`
			Unknown script "{red ${script}}".
			Perhaps you need to update package-scripts?
		`)
		break
}
