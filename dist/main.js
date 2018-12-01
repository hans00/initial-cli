'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (argv) {
	var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	var source_url = null;
	var project_path = null;
	config.github = GITHUB_URL;
	config.gitlab = GITLAB_URL;
	try {
		if (argv.length == 0) {
			throw "";
		} else if (argv.length == 1) {
			throw "Arguments not enough.";
		} else if (argv.length > 2) {
			throw "Arguments too many.";
		}
		if (/^(git|https?):\/\/([a-z0-9-]+\.)+[a-z0-9-]+\/[\w-]+\/[\w-]+(.git)?$/i.test(argv[0])) {
			source_url = argv[0];
		} else {
			source_url = parse_source_info(argv[0], config);
		}
		project_path = argv[1];
		(0, _create2.default)(source_url, project_path);
	} catch (e) {
		if (e) {
			console.log(_chalk2.default.red(e));
		}
		console.log(_chalk2.default.yellow('Usage: initial <git_repo> <project_path>'));
		process.exit(1);
	}
};

var _stringFormat = require('string-format');

var _stringFormat2 = _interopRequireDefault(_stringFormat);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _create = require('./create');

var _create2 = _interopRequireDefault(_create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GITHUB_URL = 'https://github.com/{owner}/{slug}.git';
var GITLAB_URL = 'https://gitlab.com/{owner}/{slug}.git';

function parse_source_info(arg, source_list) {
	var source = void 0,
	    info = void 0;
	if (/^[\w-]+\/[\w-]+$/i.test(arg)) {
		arg = arg.split('/');
		source = 'github';
		info = {
			owner: arg[0],
			slug: arg[1]
		};
	} else if (/^[\w-]+\/[\w-]+\/[\w-]+$/i.test(arg)) {
		arg = arg.split('/');
		source = arg[0];
		info = {
			owner: arg[1],
			slug: arg[2]
		};
	} else {
		throw "git_source format error";
	}
	if (!(source in source_list)) {
		throw "Short name not exists.";
	} else {
		return (0, _stringFormat2.default)(source_list[source], info);
	}
}