'use strict'

const getConfig = require('./utils/jest')
const jest = require('jest')

const argv = process.argv.slice(2)
const config = ['--config', JSON.stringify(getConfig())]

jest.run(argv.concat(config))
