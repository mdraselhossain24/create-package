This package is create with [Create Package](https://github.com/k15a/create-package).

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

# Table of Contents

<!-- TOC depthFrom:1 depthTo:3 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Table of Contents](#table-of-contents)
- [Configuring Targets](#configuring-targets)
	- [Node only package](#node-only-package)
	- [Web only package](#web-only-package)
- [Checking your package before publishing](#checking-your-package-before-publishing)
- [Displaying Lint Output in your Editor](#displaying-lint-output-in-your-editor)
- [Type Safety with TypeScript or Flow](#type-safety-with-typescript-or-flow)
	- [Flow](#flow)
	- [TypeScript](#typescript)
- [Formatting your code with Prettier](#formatting-your-code-with-prettier)

<!-- /TOC -->

# Configuring Targets

We use `browserslist` and the `engines.node` field in your package.json to tune the build steps for your needs. From default your package is supported by `Node >= 4` and the last 2 versions of every browser. This means should only use JS features which are supported by both environments. You may want to create a package only for node or for the web. You can do this by defining the specific environment you want to support.

This is the only place where you can configure Create Package. If you don't know how `browserslist` or the `engines.node` field works check out the following links:
- [Browserslist](https://github.com/ai/browserslist)
- [Engines](https://docs.npmjs.com/files/package.json#engines)

## Node only package

Go to your package.json and delete the browserslist field.
```diff
-   "browserslist": [
-       "last 2 versions"
-   ]
```

After that you can specify which node versions you want to support with the `engines.node` field.
```diff
    "engines": {
-       "node": ">= 4"
+       "node": ">= 6"
    }
```

## Web only package

Go to your package.json and delete the `engies.node` field.
```diff
-   "engines": {
-       "node": ">= 4"
-   }
```

After that you can specify which browsers you want to support with the browserslist.
```diff
    "browserslist": [
-       "last 2 versions"
+       "last 3 versions",
+       "ie 9"
    ]
```

# Checking your package before publishing

If you want to check all your files and run you tests before you publish you can create a `prepublish` script in you package.json:

```diff
	"scripts": {
		"build": "package-scripts build",
		"check": "package-scripts check",
		"test": "package-scripts test --watch",
+		"prepublish": "package-scripts check && package-scripts test && package-scripts build"
	}
```

# Displaying Lint Output in your Editor

Some editors, including Sublime Text, Atom, and Visual Studio Code, provide plugins for ESLint.

They are not required for linting. You should see the linter output right when you run `npm run check`. However, if you prefer the lint results to appear right in your editor, there are some extra steps you can do.

You would need to install an ESLint plugin for your editor first. Then, add a file called `.eslintrc` to the project root:

```source-js
{
    "extends": "react-app"
}
```

Now your editor should report the linting warnings.

Note that even if you edit your `.eslintrc` file further, these changes will **only affect the editor integration**. They won’t affect the `npm run check` lint output. This is because Create Package intentionally provides a minimal set of rules that find common mistakes.

# Type Safety with TypeScript or Flow

## Flow

To check our code for type safety with TypeScript we need to install `flow-bin` as a development dependency and create a `.flowconfig`.

```
npm install -D flow-bin
touch .flowconfig
```

## TypeScript

To check our code for type safety with TypeScript we need to install `typescript` as a development dependency and create a `tsconfig.json`.

```
npm install -D typescript
echo {} > tsconfig.json
```

# Formatting your code with Prettier

Prettier is an opinionated code formatter. With Prettier you can format the code you write automatically to ensure a code style within your project. See the [Prettier's GitHub page](https://github.com/prettier/prettier) for more information, and look at this [page to see it in action](https://prettier.io).

To format our code whenever we make a commit in git, we need to install the following dependencies:

```
npm install -D husky lint-staged prettier
```

- `husky` makes it easy to use githooks as if they are npm scripts.
- `lint-staged` allows us to run scripts on staged files in git. See this [blog post about lint-staged to learn more about it](https://medium.com/@okonetchnikov/make-linting-great-again-f3890e1ad6b8).
- `prettier` is the code formatter we will run before commits.

Add the following line to `scripts` section:

```diff
    "scripts": {
+       "precommit": "lint-staged",
        "start": "react-scripts start",
        "build": "react-scripts build",
```

Next we add a 'lint-staged' field to the `package.json`, for example:

```diff
    "dependencies": {
        // ...
    },
+   "lint-staged": {
+       "*.{js,ts,tsx}": [
+           "prettier --write",
+           "git add"
+       ]
+   },
    "scripts": {
```

Now, whenever you make a commit, Prettier will format the changed files automatically. You can also run `./node_modules/.bin/prettier --write "!(node_modules)/**/*.{js,ts,tsx}"` to format your entire project for the first time.

Next you might want to integrate Prettier in your favorite editor. Read the section on [Editor Integration](https://github.com/prettier/prettier#editor-integration) on the Prettier GitHub page.
