'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
function replaceRange(s, start, end, substitute) {
	return s.substring(0, start) + substitute + s.substring(end);
}

function template_process(template, variables) {
	var ECHO_EXP = /\%([A-Za-z_][A-Za-z0-9_]+)\%/;
	var IF_EXP = /\#if +([A-Za-z_][A-Za-z0-9_]+)(?: +(eq|ne) +(\'[^']*\'|"[^"]*"|true|false|\d+(?:\.\d+)?))?\#/;
	var ENDIF_EXP = /\#endif\#/;
	var match = void 0;
	// process echo
	while (match = ECHO_EXP.exec(template)) {
		var start = match.index;
		var end = match.index + match[0].length;
		if (start != 0) {
			if (template.slice(start - 1, start) == '\\') {
				continue;
			}
		}
		var var_name = match[1];
		if (var_name in variables) {
			template = replaceRange(template, start, end, variables[var_name]);
		} else {
			template = replaceRange(template, start, end, '');
		}
	}
	// process if block
	while (match = IF_EXP.exec(template)) {
		var _start = match.index;
		var _end = match.index + match[0].length;
		var condition_var = match[1];
		var condition_op = match[2];
		var condition_match = match[3];
		var endif_match = ENDIF_EXP.exec(template.slice(_end));
		if (!endif_match) {
			throw "The if block does not end!";
		}
		var end_of_block = _end + endif_match.index + endif_match[0].length;
		var content_of_block = template.slice(_end, _end + endif_match.index).trim();
		if (condition_var in variables) {
			if (!condition_op) {
				if (variables[condition_var]) {
					template = replaceRange(template, _start, end_of_block, content_of_block);
				} else {
					template = replaceRange(template, _start, end_of_block, '');
				}
			} else if (condition_op == 'eq') {
				var condition_eq = eval(condition_match);
				if (variables[condition_var] == condition_eq) {
					template = replaceRange(template, _start, end_of_block, content_of_block);
				} else {
					template = replaceRange(template, _start, end_of_block, '');
				}
			} else if (condition_op == 'ne') {
				var condition_ne = eval(condition_match);
				if (variables[condition_var] != condition_ne) {
					template = replaceRange(template, _start, end_of_block, content_of_block);
				} else {
					template = replaceRange(template, _start, end_of_block, '');
				}
			} else {
				template = replaceRange(template, _start, end_of_block, '');
			}
		} else {
			template = replaceRange(template, _start, end_of_block, '');
		}
	}
	return template;
}

exports.default = template_process;