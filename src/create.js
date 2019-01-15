import {spawn} from 'child_process'
import chalk from 'chalk'
import rimraf from 'rimraf'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import path from 'path'
import glob from 'glob'
import template_process from './template_process'

export default function (git_repo, branch, project_name) {
	const project_path = path.resolve(project_name)
	const init_file = path.resolve(project_path, '.init.js')
	const init_assets = path.resolve(project_path, '.init-assets')

	if (project_name == '.') {
		project_name = project_path.split(/.*[\/|\\]/)[1]
	}

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
				rimraf.sync(path.resolve(project_path, '*'))
				rimraf.sync(path.resolve(project_path, '.*'))
			} else {
				process.exit(0)
			}
		}
	})
	.then(() => {
		return new Promise((resolve, reject) => {
			let args = ['clone', git_repo]
			if (branch) {
				args.push('-b')
				args.push(branch)
			}
			args.push(project_path)
			const git_clone = spawn('git', args)
			git_clone.stdout.on('data', (data) => {
				console.log(data)
			})
			git_clone.stderr.on('data', (data) => {
				console.log(chalk.yellow(data))
			})
			git_clone.on('close', (code) => {
				if (code == 0) {
					rimraf.sync(path.join(project_name, '.git'))
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
		global.user_input.project_name = project_name
		process.chdir(project_path)
		const init = require(init_file)
		if (init.preprocess) {
			return init.preprocess(result, {
				rm: rimraf.sync,
				copy: fs.copySync
			})
		} else {
			return
		}
	})
	.then(() => {
		rimraf.sync(init_assets)
		rimraf.sync(init_file)
		return
	})
	.then(() => {
		return new Promise((resolve, reject) => {
			glob(path.join(project_path, '**/*.*'), (err, files) => {
				if (err) reject(err)
				files.forEach((file) => {
					if (file == init_assets || file == init_file) {
						return
					}
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
	.then(() => {
		console.log(chalk.green('Well, all done.'))
	})
	.catch((e) => {
		console.error(chalk.red(e))
		process.exit(1)
	})
}