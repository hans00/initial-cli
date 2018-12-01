import format from 'string-format'
import chalk from 'chalk'
import create from './create'

const GITHUB_URL = 'https://github.com/{owner}/{slug}.git'
const GITLAB_URL = 'https://gitlab.com/{owner}/{slug}.git'

function parse_source_info(arg, source_list) {
	if (!/^([\w-]+\/)?[\w-]+\/[\w-]+(\#[\w-]+)?$/i.test(arg)) {
		throw "git_source format error"
	}
	let source = 'github'
	let info
	arg = arg.split('/')
	if (arg.length == 2) {
		info = {
			owner: arg[0],
			slug: arg[1]
		}
	} else {
		source = arg[0]
		info = {
			owner: arg[1],
			slug: arg[2]
		}
	}
	if (!(source in source_list)) {
		throw "Short name not exists."
	} else {
		return format(source_list[source], info)
	}
}

export default function (argv, {short_name={}, alias={}}) {
	let source_url = null
	let project_name = null
	let branch = null
	short_name.github = GITHUB_URL
	short_name.gitlab = GITLAB_URL
	try {
		if (argv.length == 0) {
			throw ""
		} else if (argv.length == 1) {
			throw "Arguments not enough."
		} else if (argv.length > 2) {
			throw "Arguments too many."
		}
		if (argv[0] in alias) {
			argv[0] = alias[argv[0]]
		}
		if (argv[0].includes('#')) {
			branch = argv[0].split('#')[1]
			argv[0] = argv[0].split('#')[0]
		}
		if (/^(git|https?):\/\/([a-z0-9-]+\.)+[a-z0-9-]+\/[\w-]+\/[\w-]+(.git)?$/i.test(argv[0])) {
			source_url = argv[0]
		} else {
			source_url = parse_source_info(argv[0], short_name)
		}
		project_name = argv[1]
		create(source_url, branch, project_name)
	} catch (e) {
		if (e) {
			console.log(chalk.red(e))
		}
		console.log(chalk.yellow(`Usage: initial <git_repo> <project_path>`))
		process.exit(1)
	}
}