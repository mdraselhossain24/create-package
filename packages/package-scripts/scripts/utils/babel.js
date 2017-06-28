'use strict'

const babel = require('babel-core')
const fs = require('fs-extra')
const globby = require('globby')
const path = require('path')
const write = require('create-package-utils/write')

function transpile(source, filename, options) {
	return babel.transform(
		source,
		Object.assign({}, options, {
			filename,
		})
	)
}

function transpileFile(inputFile, outputFile, options) {
	return fs
		.readFile(inputFile, 'utf-8')
		.then(source => transpile(source, inputFile, options))
		.then(result => write(outputFile, result.code))
}

function transpileDir(inputDir, outputDir, options) {
	const filePaths = globby.sync(['/**/*.js'], {
		cwd: inputDir,
		root: inputDir,
		nodir: true,
	})

	const transpiledPaths = filePaths.map(inputPath => {
		const relativePath = path.relative(inputDir, inputPath)
		const outputPath = path.join(outputDir, relativePath)
		return transpileFile(inputPath, outputPath, options)
	})

	return Promise.all(transpiledPaths)
}

module.exports = {
	transpileFile,
	transpileDir,
}
