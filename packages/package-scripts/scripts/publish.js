'use strict'

const execa = require('execa')

const argv = process.argv.slice(2)

execa.sync('np', argv, { stdio: 'inherit' })
