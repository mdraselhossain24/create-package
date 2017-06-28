'use strict'

const warn = {
	severity: 'warning',
}

const error = {
	severity: 'error',
}

const config = {
	rules: {
		/**
		 * TypeScript-specific
		 *
		 * These rules find errors related to TypeScript features.
		 */

		// Bans specific types from being used. Does not ban the corresponding runtime objects from being used.
		'ban-types': {
			severity: 'warning',
			options: [
				[
					'Object',
					'Avoid using the `Object` type. Did you mean `object`?',
				],
				[
					'Function',
					'Avoid using the `Function` type. Prefer a specific function type, like `() => void`.',
				],
				[
					'Boolean',
					'Avoid using the `Boolean` type. Did you mean `boolean`?',
				],
				[
					'Number',
					'Avoid using the `Number` type. Did you mean `number`?',
				],
				[
					'String',
					'Avoid using the `String` type. Did you mean `string`?',
				],
				[
					'Symbol',
					'Avoid using the `Symbol` type. Did you mean `symbol`?',
				],
			],
		},

		// Disallows internal module.
		'no-internal-module': error,

		// Disallows use of internal modules and namespaces.
		'no-namespace': error,

		// Disallows /// <reference path=> imports (use ES6-style imports instead).
		'no-reference': error,

		// Disallows the use of require statements except in import statements.
		'no-var-requires': warn,

		/**
		 * Functionality
		 *
		 * These rules catch common errors in JS programming or otherwise confusing constructs that are prone to producing bugs.
		 */

		// Disallows use of arguments.callee.
		'no-caller': error,

		// Disallows any type of assignment in conditionals.
		'no-conditional-assignment': warn,

		// Disallows access to the constructors of String, Number, and Boolean.
		'no-construct': warn,

		// Disallows debugger statements.
		'no-debugger': error,

		// Warns if ‘super()’ appears twice in a constructor.
		'no-duplicate-super': error,

		// Disallows duplicate variable declarations in the same block scope.
		'no-duplicate-variable': {
			severity: 'warning',
			options: ['check-parameters'],
		},

		// Disallows eval function invocations.
		'no-eval': error,

		// Warns on use of ${ in non-template strings.
		'no-invalid-template-strings': warn,

		// Disallows shadowing variable declarations.
		'no-shadowed-variable': warn,

		// Forbids array literals to contain missing elements.
		'no-sparse-arrays': warn,

		// Flags throwing plain strings or concatenations of strings because only Errors produce proper stack traces.
		'no-string-throw': warn,

		// Disallows falling through case statements.
		'no-switch-case-fall-through': warn,

		// Disallows control flow statements, such as return, continue, break and throws in finally blocks.
		'no-unsafe-finally': warn,

		// Disallows unused expression statements.
		'no-unused-expression': {
			severity: 'warning',
			options: ['allow-fast-null-checks'],
		},

		// Disallows unused imports, variables, functions and private class members. Similar to tsc’s –noUnusedParameters and –noUnusedLocals options, but does not interrupt code compilation.
		'no-unused-variable': {
			severity: 'warning',
			options: ['check-parameters'],
		},

		// Disallows usage of variables before their declaration.
		'no-use-before-declare': warn,

		// Requires the radix parameter to be specified when calling parseInt.
		radix: warn,

		// When adding two variables, operands must both be of type number or of type string.
		'restrict-plus-operands': warn,

		// Require a default case in all switch statements.
		'switch-default': warn,

		// Requires === and !== in place of == and !=.
		'triple-equals': {
			severity: 'warning',
			options: ['allow-null-check'],
		},

		// Makes sure result of typeof is compared to correct string values.
		'typeof-compare': error,

		// Enforces use of the isNaN() function to check for NaN references instead of a comparison to the NaN constant.
		'use-isnan': warn,

		/**
		 * Maintainability
		 *
		 * These rules make code maintenance easier.
		 */

		// Disallows invocation of require().
		'no-require-imports': warn,

		/**
		 * Style
		 *
		 * These rules enforce consistent style across your codebase.
		 */

		// Disallow irregular whitespace outside of strings and comments.
		'no-irregular-whitespace': warn,
	},
}

module.exports = config
