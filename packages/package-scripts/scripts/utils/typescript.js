'use strict'

const chalk = require('chalk')
const fs = require('fs-extra')
const globby = require('globby')
const path = require('path')
const paths = require('create-package-utils/paths')
const replaceExt = require('replace-ext')
const write = require('create-package-utils/write')

function readCompilerOptionsFromTSConfig(ts) {
	const result = ts.readConfigFile(paths.tsConfig, filePath =>
		fs.readFileSync(filePath, 'utf8')
	)
	const config = result.config || {}
	const error = result.error

	if (error) {
		const message = ts.flattenDiagnosticMessageText(error.messageText, '\n')

		if (error.category === ts.DiagnosticCategory.Error) {
			throw new Error(message)
		}

		console.log(chalk.yellow(message))
	}

	return config.compilerOptions
}

function convertCompilerOptions(ts, compilerOptions) {
	const result = ts.convertCompilerOptionsFromJson(
		compilerOptions,
		paths.root
	)
	const options = result.options
	const errors = result.errors

	for (const error of errors) {
		const message = ts.flattenDiagnosticMessageText(error.messageText, '\n')

		if (error.category === ts.DiagnosticCategory.Error) {
			throw new Error(message)
		}

		console.log(chalk.yellow(message))
	}

	return options
}

function transpile(ts, source, fileName, compilerOptions) {
	const result = ts.transpileModule(source, {
		compilerOptions: convertCompilerOptions(ts, compilerOptions),
		reportDiagnostics: true,
		fileName,
	})

	if (result.diagnostics) {
		for (const error of result.diagnostics) {
			const message = ts.flattenDiagnosticMessageText(
				error.messageText,
				'\n'
			)

			if (error.category === ts.DiagnosticCategory.Error) {
				throw new Error(message)
			}

			console.log(chalk.yellow(message))
		}
	}

	return result.outputText
}

function transpileFile(ts, inputFile, outputFile, compilerOptions) {
	return fs
		.readFile(inputFile, 'utf-8')
		.then(source => transpile(ts, source, inputFile, compilerOptions))
		.then(result => write(replaceExt(outputFile, '.js'), result))
}

function transpileDir(ts, inputDir, outputDir, compilerOptions) {
	const filePaths = globby.sync(['/**/*.{ts,tsx}'], {
		cwd: inputDir,
		root: inputDir,
		nodir: true,
	})

	const transpiledPaths = filePaths.map(inputPath => {
		const relativePath = path.relative(inputDir, inputPath)
		const outputPath = path.join(outputDir, relativePath)
		return transpileFile(ts, inputPath, outputPath, compilerOptions)
	})

	return Promise.all(transpiledPaths)
}

module.exports = {
	readCompilerOptionsFromTSConfig,
	transpile,
	transpileFile,
	transpileDir,
}
