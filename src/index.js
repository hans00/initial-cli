#!/usr/bin/env node

import path from 'path'
import fs from 'fs'
import main from './main'

const argv = process.argv.slice(2)
const config_file = path.join(process.env.HOME, '.init', 'config.json')
let config = {}

if (!fs.existsSync(config_file)) {
	fs.mkdirSync(path.join(process.env.HOME, '.init'))
	fs.writeFileSync(config_file, JSON.stringify(config), 'utf8')
} else {
	config = require(config_file)
}

main(argv, config)