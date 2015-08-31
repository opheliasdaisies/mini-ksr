#!/usr/bin/env node

'use strict';

var yargs = require('yargs');
var inputDispatcher = require('./lib/cli/inputDispatcher');
var sequelize = require('./lib/utils/sequelize');
var Promise = sequelize.Promise;

// Parse arguments and options provided by user via command line.
var argv = yargs
  .usage('Usage: $0 <command> [arguments]')
  .command('project', 'Create a new project.\nTakes project name and target value as arguments.\n')
  .command('back', 'Back a project.\nTakes backer name, project name, credit card number, and pledge amount as arguments.\n')
  .command('list', 'List all pledges towards a project.\nTakes project name as argument.\n')
  .command('backer', 'List all pledges a backer has made.\nTakes backer name as argument.\n')
  .example('$0 project Project_Sugar_Cube 500', 'Create a project with the given project name and target goal.\n')
  .example('$0 back John Project_Sugar_Cube 4111111111111111 20', 'Back a given project with a credit card and an amount to pledge.\n')
  .example('$0 list Project_Sugar_Cube', 'List all pledges towards a given project.\n')
  .example('$0 backer John', 'List all the projects a backer has contributed to.\n')
  .help('h')
  .alias('h', 'help')
  .choices(command, ['project', 'back', 'list', 'backer'])
  .wrap(yargs.terminalWidth())
  .options({
    's': {
      alias: 'sync',
      boolean: true,
      describe: 'Create the tables for the database. This must be used the first time the project is run.'
    },
    'f': {
      alias: 'force',
      boolean: true,
      describe: 'Append to the sync flag to force sync and overwrite the existing tables in the database. This will erase all data.'
    }
  })
  .argv;

// argv._ is an array of all non-hyphenated arguments supplied.
var args = argv._;
// The first will always be the command, and the following will be the arguments to be passed.
var command = args.shift();

// Pass the user input to the inputDispatcher module.
function takeUserInput(cmd, argArr){
  return inputDispatcher(cmd, argArr)
    // If the command doesn't exist, show help.
    .catch(function(){
      // If the -s flag was used, do not show help, as the user may have only synced the tables without adding a command.
      if (!argv.s){
        yargs.showHelp();
      }
    })
    .finally(function(){
      // Close the connection to the database.
      sequelize.close();
    });
}

// If -s is included, the database tables will be created. If -sf is included, the tables will be deleted and then re-created. If -s is not used, a promise will be returned.
function checkSyncOptions(argv){
  if (argv.s) {
    // Check for force option.
    var options = (argv.f ? {force: true} : {});
    var message = 'Tables have been created ';
    // Adjust message to be printed based on if force option was added.
    message += (argv.f ? 'or overwritten.' : 'if they did not exist.');

    // Sync the database tables
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
