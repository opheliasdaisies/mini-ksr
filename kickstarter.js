#!/usr/bin/env node

'use strict';

var argv = require('yargs');
var subHelpOptions = require('./lib/utils/cmdLineHelpFunctions');
var inputDispatcher = require('./lib/controllers/inputDispatcher');
var sequelize = require('./lib/utils/sequelize');

var args = argv.argv._;
var command = args.shift();

argv
  .usage('Usage: $0 <command> [arguments]')
  .command('project', 'Create a new project.\nTakes project name and target value as arguments.\n', subHelpOptions.project)
  .command('back', 'Back a project.\nTakes backer name, project name, credit card number, and pledge amount as arguments.\n', subHelpOptions.back)
  .command('list', 'List all pledges towards a project.\nTakes project name as argument.\n', subHelpOptions.list)
  .command('backer', 'List all pledges a backer has made.\nTakes backer name as argument.\n', subHelpOptions.backer)
  .demand(2, 5, 'Please use a valid command and supply the correct number of arguments. The -help flag will provide more information for any given command.\n')
  .example('$0 project Project_Sugar_Cube 500', 'Create a project with the given project name and target goal.\n')
  .example('$0 back John Project_Sugar_Cube 4111111111111111 20', 'Back a given project with a credit card and an amount to pledge.\n')
  .example('$0 list Project_Sugar_Cube', 'List all pledges towards a given project.\n')
  .example('$0 backer John', 'List all the projects a backer has contributed to.\n')
  .help('h')
  .alias('h', 'help')
  .choices(command, ['project', 'back', 'list', 'backer'])
  .wrap(argv.terminalWidth())
  .argv;

inputDispatcher(command, args)
  .then(function(){
    sequelize.close();
  });
