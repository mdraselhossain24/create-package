'use strict'

const env = require('create-package-utils/env')

env.check()

const config = {
	// Use babel-eslint to parse async/await
	parser: 'babel-eslint',
	parserOptions: {
		ecmaVersion: 2017,
		sourceType: 'module',
		ecmaFeatures: {
			impliedStrict: true,
			jsx: true,
			experimentalObjectRestSpread: true,
		},
	},
	// Set env based on create-package env
	env: {
		browser: !env.targets.node,
		node: !env.targets.web,
		commonjs: true,
		'shared-node-browser': env.targets.universal,
		es6: true,
		worker: env.targets.web,
		serviceworker: env.targets.web,
		jest: true,
	},
	plugins: ['import'],
	settings: {
		'import/extensions': ['.js', '.ts', '.tsx'],
	},
	rules: {
		/**
		 * Possible Errors
		 *
		 * These rules relate to possible syntax or logic errors in JavaScript code.
		 */

		// Enforce "for" loop update clause moving the counter in the right direction.
		'for-direction': 'warn',

		// Disallow comparing against -0.
		'no-compare-neg-zero': 'warn',

		// Disallow assignment operators in conditional expressions.
		'no-cond-assign': ['warn', 'always'],

		// Disallow control characters in regular expressions
		'no-control-regex': 'warn',

		// Disallow the use of debugger.
		'no-debugger': 'error',

		// Disallow duplicate arguments in function definitions.
		'no-dupe-args': 'error',

		// Disallow duplicate keys in object literals.
		'no-dupe-keys': 'error',

		// Disallow duplicate case labels.
		'no-duplicate-case': 'warn',

		// Disallow empty character classes in regular expressions.
		'no-empty-character-class': 'warn',

		// Disallow reassigning exceptions in catch clauses.
		'no-ex-assign': 'warn',

		// Disallow reassigning function declarations.
		'no-func-assign': 'warn',

		// Disallow invalid regular expression strings in RegExp constructors.
		'no-invalid-regexp': 'error',

		// Disallow irregular whitespace outside of strings and comments.
		'no-irregular-whitespace': 'warn',

		// Disallow calling global object properties as functions-
		'no-obj-calls': 'error',

		// Disallow multiple spaces in regular expressions.
		'no-regex-spaces': 'warn',

		// Disallow sparse arrays.
		'no-sparse-arrays': 'warn',

		// Disallow template literal placeholder syntax in regular strings.
		'no-template-curly-in-string': 'warn',

		// Disallow confusing multiline expressions.
		'no-unexpected-multiline': 'warn',

		// Disallow unreachable code after return, throw, continue, and break statements.
		'no-unreachable': 'warn',

		// Disallow control flow statements in finally blocks.
		'no-unsafe-finally': 'warn',

		// Disallow negating the left operand of relational operators.
		'no-unsafe-negation': 'warn',

		// Require calls to isNaN() when checking for NaN.
		'use-isnan': 'warn',

		// Enforce comparing typeof expressions against valid strings.
		'valid-typeof': 'error',

		/**
		 * Best Practices
		 *
		 * These rules relate to better ways of doing things to help you avoid problems.
		 */

		// Enforce return statements in callbacks of array methods.
		'array-callback-return': 'warn',

		// Require default cases in switch statements.
		'default-case': 'warn',

		// Require the use of === and !==.
		eqeqeq: ['warn', 'allow-null'],

		// Disallow the use of arguments.caller or arguments.callee.
		'no-caller': 'error',

		// Disallow lexical declarations in case clauses.
		'no-case-declarations': 'warn',

		// disallow empty destructuring patterns.
		'no-empty-pattern': 'warn',

		// Disallow the use of eval().
		'no-eval': 'error',

		// Disallow extending native types.
		'no-extend-native': 'warn',

		// Disallow unnecessary labels.
		'no-extra-bind': 'warn',

		// Disallow unnecessary labels.
		'no-extra-label': 'warn',

		// Disallow fallthrough of case statements.
		'no-fallthrough': 'warn',

		// Disallow the use of eval()-like methods.
		'no-implied-eval': 'error',

		// Disallow the use of the __iterator__ property.
		'no-iterator': 'warn',

		// Disallow labeled statements.
		'no-labels': 'warn',

		// Disallow unnecessary nested blocks.
		'no-lone-blocks': 'warn',

		// Disallow function declarations and expressions inside loop statements.
		'no-loop-func': 'warn',

		// Disallow multiline strings.
		'no-multi-str': 'warn',

		// Disallow new operators with the Function object.
		'no-new-func': 'error',

		// Disallow new operators with the String, Number, and Boolean objects.
		'no-new-wrappers': 'warn',

		// Disallow octal literals.
		'no-octal': 'error',

		// Disallow octal escape sequences in string literals.
		'no-octal-escape': 'error',

		// Disallow variable redeclaration.
		'no-redeclare': 'warn',

		// Disallow javascript: urls.
		'no-script-url': 'warn',

		// Disallow assignments where both sides are exactly the same.
		'no-self-assign': 'warn',

		// Disallow comparisons where both sides are exactly the same.
		'no-self-compare': 'warn',

		// Disallow comma operators.
		'no-sequences': 'warn',

		// Disallow throwing literals as exceptions.
		'no-throw-literal': 'warn',

		// Disallow unused expressions.
		'no-unused-expressions': [
			'warn',
			{
				allowShortCircuit: true,
				allowTernary: true,
			},
		],

		// Disallow unused labels.
		'no-unused-labels': 'warn',

		// Disallow unnecessary calls to .call() and .apply().
		'no-useless-call': 'warn',

		// Disallow unnecessary concatenation of literals or template literals.
		'no-useless-concat': 'warn',

		// Disallow unnecessary escape characters.
		'no-useless-escape': 'warn',

		// Disallow redundant return statements.
		'no-useless-return': 'warn',

		// Disallow with statements.
		'no-with': 'error',

		// Enforce the consistent use of the radix argument when using parseInt().
		radix: 'warn',

		// Disallow async functions which have no await expression.
		'require-await': 'warn',

		/**
		 * Strict Mode
		 *
		 * These rules relate to strict mode directives.
		 */

		// Require or disallow strict mode directives.
		strict: ['warn', 'never'],

		/**
		 * Variables
		 *
		 * These rules relate to variable declarations.
		 */

		// Disallow deleting variables.
		'no-delete-var': 'error',

		// Disallow labels that share a name with a variable.
		'no-label-var': 'warn',

		// Disallow specified global variables.
		'no-restricted-globals': [
			'warn',
			'addEventListener',
			'blur',
			'close',
			'closed',
			'confirm',
			'defaultStatus',
			'defaultstatus',
			'event',
			'external',
			'find',
			'focus',
			'frameElement',
			'frames',
			'history',
			'innerHeight',
			'innerWidth',
			'length',
			'location',
			'locationbar',
			'menubar',
			'moveBy',
			'moveTo',
			'name',
			'onblur',
			'onerror',
			'onfocus',
			'onload',
			'onresize',
			'onunload',
			'open',
			'opener',
			'opera',
			'outerHeight',
			'outerWidth',
			'pageXOffset',
			'pageYOffset',
			'parent',
			'print',
			'removeEventListener',
			'resizeBy',
			'resizeTo',
			'screen',
			'screenLeft',
			'screenTop',
			'screenX',
			'screenY',
			'scroll',
			'scrollbars',
			'scrollBy',
			'scrollTo',
			'scrollX',
			'scrollY',
			'self',
			'status',
			'statusbar',
			'stop',
			'toolbar',
			'top',
		],

		// Disallow variable declarations from shadowing variables declared in the outer scope.
		'no-shadow': 'warn',

		// Disallow identifiers from shadowing restricted names.
		'no-shadow-restricted-names': 'warn',

		// Disallow the use of undeclared variables unless mentioned in /* global */ comments.
		'no-undef': 'error',

		// Disallow unused variables.
		'no-unused-vars': 'warn',

		// Disallow the use of variables before they are defined.
		'no-use-before-define': [
			'warn',
			{
				functions: false,
				classes: false,
				variables: false,
			},
		],

		/**
		 * ECMAScript 6
		 *
		 * These rules relate to ES6, also known as ES2015:
		 */

		// Require super() calls in constructors.
		'constructor-super': 'error',

		// Disallow reassigning class members.
		'no-class-assign': 'warn',

		// Disallow reassigning const variables.
		'no-const-assign': 'error',

		// Disallow duplicate class members
		'no-dupe-class-members': 'error',

		// Disallow new operators with the Symbol object.
		'no-new-symbol': 'error',

		// Disallow this/super before calling super() in constructors.
		'no-this-before-super': 'warn',

		// Disallow unnecessary computed property keys in object literals.
		'no-useless-computed-key': 'warn',

		// Disallow unnecessary constructors.
		'no-useless-constructor': 'warn',

		// Disallow renaming import, export, and destructured assignments to the same name.
		'no-useless-rename': 'warn',

		// Require generator functions to contain yield.
		'require-yield': 'warn',

		/**
		 * eslint-plugin-import
		 */

		// Ensure imports point to a file/module that can be resolved.
		'import/no-unresolved': 'error',

		// Ensure named imports correspond to a named export in the remote file.
		'import/named': 'error',

		// Ensure a default export is present, given a default import.
		'import/default': 'error',

		// Ensure imported namespaces contain dereferenced properties as they are dereferenced.
		'import/namespace': 'error',

		// Report any invalid exports, i.e. re-export of the same name.
		'import/export': 'error',

		// Report use of exported name as identifier of default export.
		'import/no-named-as-default': 'warn',

		// Report use of exported name as property of default export.
		'import/no-named-as-default-member': 'warn',

		// Report CommonJS `require` calls and `module.exports` or `exports.*`.
		'import/no-commonjs': 'warn',

		// Report AMD `require` and `define` calls.
		'import/no-amd': 'error',

		// No Node.js builtin modules.
		'import/no-nodejs-modules': !env.targets.web ? 'off' : 'error',
	},
}

module.exports = config
