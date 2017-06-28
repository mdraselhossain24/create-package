'use strict'

const jest = require('jest')
const getConfig = require('./utils/jest')

const argv = process.argv.slice(2)
const config = ['--config', JSON.stringify(getConfig())]

jest.run(argv.concat(config))
