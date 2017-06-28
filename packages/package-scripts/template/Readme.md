This package is create with [Create Package](https://github.com/k15a/create-package).

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

# Table of Contents

<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Table of Contents](#table-of-contents)
- [Displaying Lint Output in your Editor](#displaying-lint-output-in-your-editor)
- [Type Safety with TypeScript or Flow](#type-safety-with-typescript-or-flow)
	- [Flow](#flow)
	- [TypeScript](#typescript)
- [Formatting your code with Prettier](#formatting-your-code-with-prettier)

<!-- /TOC -->

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

```source-diff
    "scripts": {
+       "precommit": "lint-staged",
        "start": "react-scripts start",
        "build": "react-scripts build",
```

Next we add a 'lint-staged' field to the `package.json`, for example:

```source-diff
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
