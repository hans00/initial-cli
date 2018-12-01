#!/usr/bin/env node

import path from 'path'
import fs from 'fs'
import main from './main'

const user_home = process.env.HOME || process.env.HOMEPATH

const argv = process.argv.slice(2)
const config_file = path.join(user_home, '.init', 'config.json')
let config = {}

if (!fs.existsSync(config_file)) {
	fs.mkdirSync(path.join(user_home, '.init'))
	fs.writeFileSync(config_file, JSON.stringify(config), 'utf8')
} else {
	config = require(config_file)
}

main(argv, config)