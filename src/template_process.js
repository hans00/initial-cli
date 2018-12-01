function replaceRange(s, start, end, substitute) {
	if (substitute == '') {
		if (s.substring(start-2, start) == '\r\n') {
			start -= 2
		} else if (s.substring(start-1, start) == '\n') {
			start -= 1
		} else if (s.substring(end, end+2) == '\r\n') {
			end += 2
		} else if (s.substring(end, end+1) == '\n') {
			end += 1
		}
		return s.substring(0, start) + s.substring(end)
	} else {
		return s.substring(0, start) + substitute + s.substring(end)
	}
}

function template_process(template, variables) {
	const ECHO_EXP = /\%([A-Za-z_][A-Za-z0-9_]+)\%/
	const IF_EXP = /\#if +([A-Za-z_][A-Za-z0-9_]+)(?: +(eq|ne|has) +(\'[^']*\'|"[^"]*"|true|false|\d+(?:\.\d+)?))?\#/
	const ENDIF_EXP = /\#endif\#/
	let match
	// process echo
	while (match = ECHO_EXP.exec(template)) {
		const start = match.index
		const end = match.index + match[0].length
		if (start != 0) {
			if (template.slice(start-1, start) == '\\') {
				continue
			}
		}
		const var_name = match[1]
		if (var_name in variables) {
			template = replaceRange(template, start, end, variables[var_name])
		} else {
			template = replaceRange(template, start, end, '')
		}
	}
	// process if block
	while (match = IF_EXP.exec(template)) {
		const condition_var = match[1]
		const condition_op = match[2]
		const condition_match = match[3]
		const end = match.index + match[0].length
		const endif_match = ENDIF_EXP.exec(template.slice(end))
		if (!endif_match) {
			throw "The if block does not end!"
		}
		const content_of_block = template.slice(end, end + endif_match.index)
		let start_of_block = match.index
		let end_of_block = end + endif_match.index + endif_match[0].length
		if (condition_var in variables) {
			if (!condition_op) {
				if (variables[condition_var]) {
					template = replaceRange(template, start_of_block, end_of_block, content_of_block)
				} else {
					template = replaceRange(template, start_of_block, end_of_block, '')
				}
			} else if (condition_op == 'eq') {
				const condition_eq = eval(condition_match)
				if (variables[condition_var] == condition_eq) {
					template = replaceRange(template, start_of_block, end_of_block, content_of_block)
				} else {
					template = replaceRange(template, start_of_block, end_of_block, '')
				}
			} else if (condition_op == 'ne') {
				const condition_ne = eval(condition_match)
				if (variables[condition_var] != condition_ne) {
					template = replaceRange(template, start_of_block, end_of_block, content_of_block)
				} else {
					template = replaceRange(template, start_of_block, end_of_block, '')
				}
			} else if (condition_op == 'has') {
				const condition_has = eval(condition_match)
				if (variables[condition_var].includes(condition_has)) {
					template = replaceRange(template, start_of_block, end_of_block, content_of_block)
				} else {
					template = replaceRange(template, start_of_block, end_of_block, '')
				}
			} else {
				template = replaceRange(template, start_of_block, end_of_block, '')
			}
		} else {
			template = replaceRange(template, start_of_block, end_of_block, '')
		}
	}
	return template
}

export default template_process