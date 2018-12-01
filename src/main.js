import format from 'string-format'
import chalk from 'chalk'
import create from './create'

const GITHUB_URL = 'https://github.com/{owner}/{slug}.git'
const GITLAB_URL = 'https://gitlab.com/{owner}/{slug}.git'

function parse_source_info(arg, source_list) {
	let source, info
	if (/^[\w-]+\/[\w-]+$/i.test(arg)) {
		arg = arg.split('/')
		source = 'github'
		info = {
			owner: arg[0],
			slug: arg[1]
		}
	} else if (/^[\w-]+\/[\w-]+\/[\w-]+$/i.test(arg)) {
		arg = arg.split('/')
		source = arg[0]
		info = {
			owner: arg[1],
			slug: arg[2]
		}
	} else {
		throw "git_source format error"
	}
	if (!(source in source_list)) {
		throw "Short name not exists."
	} else {
		return format(source_list[source], info)
	}
}

export default function (argv, config={}) {
	let source_url = null
	let project_path = null
	config.github = GITHUB_URL
	config.gitlab = GITLAB_URL
	try {
		if (argv.length == 0) {
			throw ""
		} else if (argv.length == 1) {
			throw "Arguments not enough."
		} else if (argv.length > 2) {
			throw "Arguments too many."
		}
		if (/^(git|https?):\/\/([a-z0-9-]+\.)+[a-z0-9-]+\/[\w-]+\/[\w-]+(.git)?$/i.test(argv[0])) {
			source_url = argv[0]
		} else {
			source_url = parse_source_info(argv[0], config)
		}
		project_path = argv[1]
		create(source_url, project_path)
	} catch (e) {
		if (e) {
			console.log(chalk.red(e))
		}
		console.log(chalk.yellow(`Usage: initial <git_repo> <project_path>`))
		process.exit(1)
	}
}