#!/usr/bin/env node

var DISCOURSE_URL = 'https://frm.hackafe.org'
global.CMD_NAME = 'hackafe-meetups'

var optimist = require('optimist')
var rc = require('rc')

process.title = global.CMD_NAME
var argv = rc(global.CMD_NAME, { url: DISCOURSE_URL }, optimist
  .usage('Usage: $0 command [options]')
  .alias('h', 'host').describe('h', 'url of discourse instance').default('h', DISCOURSE_URL).string('h')
  .alias('k', 'apikey').describe('k', 'api key from ' + DISCOURSE_URL + '/admin/api').string('k')
  .alias('u', 'username').describe('u', 'username to execute operations').default('u', 'system').string('u')
  .alias('f', 'dry-run').describe('f', 'don\'t make any changes, just print what would do').boolean('f')
  .describe('version', 'prints current version').boolean('boolean')
  .argv)

if (argv.version) {
  var pkg = require('./package')
  console.error(pkg.name, pkg.version)
  process.exit(0)
}

var command = argv._[ 0 ]

if (!command) {
  optimist.showHelp()
  process.exit(1)
}

if (!argv.host || !argv.apikey || !argv.username) {
  optimist.showHelp()
  console.error('host, apikey and username options are required. They can be specified in a ~/.' + global.CMD_NAME + 'rc file')
  process.exit(1)
}

var Discourse = require('discourse-api')
var frm = new Discourse(argv.host, argv.apikey, argv.username)

var commandHandler
try {
  commandHandler = require('./cmd/' + command)
} catch (e) {
  console.error('Unknown command ' + command)
  process.exit(2)
}

require('./lib/helpers')

commandHandler(argv, frm)
