import {spawn} from 'child_process'
import chalk from 'chalk'
import fs from 'fs'
import rimraf from 'rimraf'
import inquirer from 'inquirer'
import path from 'path'
import glob from 'glob'
import template_process from './template_process'

export default function (git_repo, project_path) {
	const init_file = path.resolve(project_path, '.init.js')

	let confirm = []
	if (fs.existsSync(project_path)) {
		confirm.push({
			type: 'confirm',
			name: 'remove_old',
			message: 'Path exists, would you want to replace it?',
			default: false
		})
	}

	const prompt = inquirer.createPromptModule()
	prompt(confirm)
	.then((result) => {
		if ('remove_old' in result) {
			if (result.remove_old) {
				rimraf.sync(project_path)
			} else {
				process.exit(0)
			}
		}
	})
	.then(() => {
		return new Promise((resolve, reject) => {
			const git_clone = spawn('git', ['clone', git_repo, project_path])
			git_clone.stdout.on('data', (data) => {
				console.log(data)
			})
			git_clone.stderr.on('data', (data) => {
				console.log(chalk.yellow(data))
			})
			git_clone.on('close', (code) => {
				if (code == 0) {
					rimraf.sync(path.join(project_path, '.git'))
					resolve()
				} else {
					reject()
				}
			})
		})
	})
	.then(() => {
		if (!fs.existsSync(init_file)) {
			console.log(chalk.green('Done'))
			process.exit(0)
		} else {
			return require(init_file).questions
		}
	})
	.then((questions) => prompt(questions))
	.then((result) => {
		global.user_input = result
		const init = require(init_file)
		if (init.preprocess) {
			return init.preprocess(result)
		} else {
			return
		}
	})
	.then(() => {
		rimraf.sync(path.join(project_path, '.init-assets'))
		rimraf.sync(path.join(project_path, '.init.js'))
		return
	})
	.then(() => {
		return new Promise((resolve, reject) => {
			glob(path.join(project_path, '**/*.*'), (err, files) => {
				if (err) reject(err)
				files.forEach((file) => {
					const content = fs.readFileSync(file, 'utf8')
					try {
						fs.writeFileSync(file, template_process(content, global.user_input), 'utf8')
					} catch (e) {
						reject(e)
					}
				})
				resolve()
			})
		})
	})
	.then(() => console.log(chalk.green('Well, all done.')))
	.catch((e) => {
		console.error(chalk.red(e))
		process.exit(1)
	})
}