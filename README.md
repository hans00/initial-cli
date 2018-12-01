# initial-cli

A project initializer.

---

## How to use

### from GitHub

```sh
initial <owner>/<slug> <project name>
// or
initial github/<owner>/<slug> <project name>
```

### from GitLab

```sh
initial gitlab/<owner>/<slug> <project name>
```

### from other git repo

```sh
initial <git repo url> <project name>
// or pre-set short name
initial <short name>/<owner>/<slug> <project name>
```

### Configure file

#### `$HOME`/.init/config.json

```json
{
    "short_name": {
        "private-git": "https://example.com/{owner}/{slug}.git"
    }
}
```

## How create template

### Assets file

> The asset files will remove after initialized.
> You can put the option files in it.
> 
> The directory name is `.init-assets`.

### Initialize file

> File name: `.init.js`
> 
> Inquire uses module who names `Inquirer.js`.

```js
// you can require: fs, path, glob, rimraf, and other core modules
exports.questions = [
    {} // your questions, see: Inquirer.js
];
exports.preprocess = function (answer) {
    // the JS codes
    // you can copy the file from assets
}
```

### Template files

> All `*.*` file except `.init.js` or under `.init-assets`
> 
> All question answer and project_name will pass into the template processor.

Usage

```js
// direct output variable using syntax as %var_name%
title = "%project_name%"
// boolean condition
#if boolVal#
#endif#
#if boolVar eq true#
#endif#
// string condition
#if strVar eq 'value'#
#endif#
#if strVar ne 'value'#
#endif#
// list condition
#if listVar has 'value'#
#endif#
```