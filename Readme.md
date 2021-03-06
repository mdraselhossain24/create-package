# Create Package

Create npm packages with no build configuration.
* [Getting Started](#getting-started) — How to create a new package.
* [User Guide](https://github.com/k15a/create-package/blob/master/packages/package-scripts/template/Readme.md) — How to develop packages bootstrapped with Create Package.

<details>
<summary>Table of Content</summary>
<!-- TOC depthFrom:2 depthTo:3 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Problem](#problem)
- [Solution](#solution)
- [Why Use This?](#why-use-this)
- [Getting Started](#getting-started)
	- [Installation](#installation)
- [Usage](#usage)
	- [`npm test --watch` or `yarn test --watch`](#npm-test-watch-or-yarn-test-watch)
	- [`npm run build` or `yarn build`](#npm-run-build-or-yarn-build)
	- [`npm run check` or `yarn run check`](#npm-run-check-or-yarn-run-check)
- [Converting to a Custom Setup](#converting-to-a-custom-setup)
- [Philosophy](#philosophy)
- [Inspiration](#inspiration)
	- [Create React App](#create-react-app)
- [Thanks](#thanks)
- [Related](#related)
- [Support](#support)
- [License](#license)

<!-- /TOC -->
</details>

## Problem

Creating npm packages is awesome but setting up the build tools every time is exhausting and not productive.

## Solution

With Create Package you don't need to configure Babel, Rollup, Flow or TypeScript.<br>
They are preconfigured and hidden behind a single dependency.

Just create a project and start coding. You don't have to worry how to set up the build tools and update them.

## Why Use This?

If you want to create a npm package but don't want to configure build tools you should use Create Package. You will get everything you need to create modern npm packages:
- Latest JavaScript features with Babel
- Optional TypeScript and Flow support
- Node and Web packages
- Snapshot testing with Jest
- Assistant while developing with ESLint and TSLint

## Getting Started

### Installation

Install Create Package once globally:

```
npm install -g create-package
```
Create Package supports `Node >= 4` and `npm >= 3`. You can use [n](https://github.com/tj/n) or [nvm](https://github.com/creationix/nvm) to easily switch Node versions between different projects.

## Usage

To create a new package run:
```
create-package my-awesome-package
cd my-awesome-package
```
This will create a new directory called `my-awesome-package` inside the current working directory.<br>
Inside this directory, we will create a simple initial project structure with our only dependency `package-scripts` installed.

```
my-awesome-package
├── .gitignore
├── node_modules
├── package.json
├── Readme.md
└── src
    ├── index.js
    └── index.test.js
```

Once the installation is done, you can run some commands inside the project folder:

### `npm test --watch` or `yarn test --watch`

This will run the Jest test runner in watch mode.

### `npm run build` or `yarn build`

This will compile all your files and creates a UMD bundle if you want to support the web.

#### What we do?

We check which environments you want to support with browserslist and the `engines.node` field in you package.json.

- **Node Environment** — We compile all your JS, Flow and TypeScript files to the lowest Node version you want to support to the lib directory.

- **Web Environment** — In addition to the lib folder we also compile your files to an es directory which is the same but with ES modules instead of CommonJS modules for Rollup and WebPack. We also create a UMD bundle which you can use for script tags or unpkg.com.

### `npm run check` or `yarn run check`

This will run ESLint to check for common errors. We don't want to stay in your way while hacking. Please feel free to open an issue if a linting rule annoys you.

If you have TypeScript or Flow installed we also check for type errors with this command.

## Philosophy

- **One Dependency** — Nice developer experience and easy way to update your build tools.

- **No configuration needed** — We want you to focus on creating awesome packages so we will handle the configuration for you.

- **Latest JS Features** — You can use the latest JS features and we will compile them down to support older environments.

- **Types with Flow and TS** — Easily add support for TypeScript and Flow.

## Inspiration

### Create React App

Create Package is heavily inspired and copied from Create React App. Check it out if you want to get started with React!

## Thanks

- [Create React App](https://github.com/facebookincubator/create-react-app)
- [Cole Chamberlain](https://github.com/cchamberlain) for giving me the `create-package` name
- [Cory Simmons](https://github.com/corysimmons) for giving me the `package-scripts` name

## Related

- [create-npm-package](https://github.com/MatteoGabriele/create-npm-package) — boilerplate for npm packages
- [generator-kcd-oss](https://github.com/kentcdodds/generator-kcd-oss) — A yeoman generator for open source modules

## Support

Feel free to create an issue or hit me up on [Twitter](https://twitter.com/_konsch)

## License

MIT

Keep smiling 😊  and stay awesome! 🌈
