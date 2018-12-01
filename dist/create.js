'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (git_repo, project_path) {
	var init_file = _path2.default.resolve(project_path, '.init.js');

	var confirm = [];
	if (_fs2.default.existsSync(project_path)) {
		confirm.push({
			type: 'confirm',
			name: 'remove_old',
			message: 'Path exists, would you want to replace it?',
			default: false
		});
	}

	var prompt = _inquirer2.default.createPromptModule();
	prompt(confirm).then(function (result) {
		if ('remove_old' in result) {
			if (result.remove_old) {
				_rimraf2.default.sync(project_path);
			} else {
				process.exit(0);
			}
		}
	}).then(function () {
		return new Promise(function (resolve, reject) {
			var git_clone = (0, _child_process.spawn)('git', ['clone', git_repo, project_path]);
			git_clone.stdout.on('data', function (data) {
				console.log(data);
			});
			git_clone.stderr.on('data', function (data) {
				console.log(_chalk2.default.yellow(data));
			});
			git_clone.on('close', function (code) {
				if (code == 0) {
					_rimraf2.default.sync(_path2.default.join(project_path, '.git'));
					resolve();
				} else {
					reject();
				}
			});
		});
	}).then(function () {
		if (!_fs2.default.existsSync(init_file)) {
			console.log(_chalk2.default.green('Done'));
			process.exit(0);
		} else {
			return require(init_file).questions;
		}
	}).then(function (questions) {
		return prompt(questions);
	}).then(function (result) {
		global.user_input = result;
		var init = require(init_file);
		return init.start(result);
	}).then(function () {
		_rimraf2.default.sync(_path2.default.join(project_path, '.init-assets'));
		_rimraf2.default.sync(_path2.default.join(project_path, '.init.js'));
		return;
	}).then(function () {
		return new Promise(function (resolve, reject) {
			(0, _glob2.default)(_path2.default.join(project_path, '**/*.*'), function (err, files) {
				if (err) reject(err);
				files.forEach(function (file) {
					var content = _fs2.default.readFileSync(file, 'utf8');
					try {
						_fs2.default.writeFileSync(file, (0, _template_process2.default)(content, global.user_input), 'utf8');
					} catch (e) {
						reject(e);
					}
				});
				resolve();
			});
		});
	}).then(function () {
		return console.log(_chalk2.default.green('Well, all done.'));
	}).catch(function (e) {
		console.error(_chalk2.default.red(e));
		process.exit(1);
	});
};

var _child_process = require('child_process');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _template_process = require('./template_process');

var _template_process2 = _interopRequireDefault(_template_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }