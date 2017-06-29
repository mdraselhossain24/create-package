'use strict'

const fs = require('fs-extra')
const path = require('path')

const root = fs.realpathSync(process.cwd())
const src = resolvePath('src')
const lib = resolvePath('lib')
const es = resolvePath('es')
const dist = resolvePath('dist')
const compiled = resolvePath('compiled')
const pkg = resolvePath('package.json')
const yarnLock = resolvePath('yarn.lock')
const flowConfig = resolvePath('.flowconfig')
const tsConfig = resolvePath('tsconfig.json')
const index = {
	js: path.join(src, 'index.js'),
	ts: path.join(src, 'index.ts'),
	tsx: path.join(src, 'index.tsx'),
	lib: path.join(lib, 'index.js'),
	es: path.join(es, 'index.js'),
}

function resolvePath(relativePath) {
	return path.resolve(root, relativePath)
}

module.exports = {
	root,
	src,
	lib,
	es,
	dist,
	compiled,
	pkg,
	yarnLock,
	flowConfig,
	tsConfig,
	index,
}
