'use strict'

const paths = require('./paths')
const resolveFrom = require('resolve-from')

const ts = require(resolveFrom(paths.root, 'typescript'))

module.exports = ts
