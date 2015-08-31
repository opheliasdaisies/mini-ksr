#!/usr/bin/env node

'use strict';

var yargs = require('yargs');
var subHelpOptions = require('./lib/utils/cmdLineHelpFunctions');
var inputDispatcher = require('./lib/controllers/inputDispatcher');
var sequelize = require('./lib/utils/sequelize');
var Promise = sequelize.Promise;

var argv = yargs
  .usage('Usage: $0 <command> [arguments]')
  .command('project', 'Create a new project.\nTakes project name and target value as arguments.\n', subHelpOptions.project)
  .command('back', 'Back a project.\nTakes backer name, project name, credit card number, and pledge amount as arguments.\n', subHelpOptions.back)
  .command('list', 'List all pledges towards a project.\nTakes project name as argument.\n', subHelpOptions.list)
  .command('backer', 'List all pledges a backer has made.\nTakes backer name as argument.\n', subHelpOptions.backer)

  .example('$0 project Project_Sugar_Cube 500', 'Create a project with the given project name and target goal.\n')
  .example('$0 back John Project_Sugar_Cube 4111111111111111 20', 'Back a given project with a credit card and an amount to pledge.\n')
  .example('$0 list Project_Sugar_Cube', 'List all pledges towards a given project.\n')
  .example('$0 backer John', 'List all the projects a backer has contributed to.\n')
  .boolean('s')
  .alias('s', 'sync')
  .boolean('f')
  .alias('f', 'force')
  .describe({
    s: 'Create the tables for the database. This must be used the first time the project is run.',
    f: 'Append to the sync flag to force sync and overwrite the existing tables in the database. This will erase all data.'
  })
  .help('h')
  .alias('h', 'help')
  .choices(command, ['project', 'back', 'list', 'backer'])
  .wrap(yargs.terminalWidth())
  .argv;

var args = argv._;
var command = args.shift();

function takeUserInput(cmd, argArr){
  return inputDispatcher(cmd, argArr)
    .catch(function(){
      if (!argv.s){
        yargs.showHelp();
      }
    })
    .finally(function(){
      sequelize.close();
    });
}

function checkSyncOptions(argv){
  if (argv.s) {
    var options = (argv.f ? {force: true} : {});
    var message = 'Tables have been created ';
    message += (argv.f ? 'or overwritten.' : 'if they did not exist.');
    return sequelize.sync(options)
      .then(function(){
        console.log(message);
      });
  }
  return Promise.resolve();
}

checkSyncOptions(argv)
  .then(function(){
    return takeUserInput(command, args);
  });
