#!/usr/bin/env node
'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _main = require('./main');

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var argv = process.argv.slice(2);
var config_file = _path2.default.join(process.env.HOME, '.init', 'config.json');
var config = {};

if (!_fs2.default.existsSync(config_file)) {
	_fs2.default.mkdirSync(_path2.default.join(process.env.HOME, '.init'));
	_fs2.default.writeFileSync(config_file, JSON.stringify(config), 'utf8');
} else {
	config = require(config_file);
}

(0, _main2.default)(argv, config);