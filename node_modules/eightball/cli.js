#!/usr/bin/env node
'use strict';
var argv = require('minimist')(process.argv.slice(2));
var pkg = require('./package.json');
var eightBall = require('./');

function help() {
	console.log([
		pkg.description,
		'',
		'Example',
		'  $ eightball',
		'  Without a doubt'
	].join('\n'));
}

if (argv.help) {
	help();
	return;
}

if (argv.version) {
	console.log(pkg.version);
	return;
}

console.log(eightBall());
