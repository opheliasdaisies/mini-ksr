'use strict';

function projectHelp(argv) {
  return argv.usage('Usage: $0 project <projectName> <targetAmount>')
    .help('h')
    .example('$0 project Project_Sugar_Cube 500', 'Create a project with the given project name and target goal.')
    .alias('h', 'help')
    .argv;
}

function backHelp(argv) {
  return argv.usage('Usage: $0 back <backerName> <projectName> <creditCard> <pledgeAmount>')
    .help('h')
    .example('$0 back John Project_Sugar_Cube 4111111111111111 20', 'Back a given project with a credit card and an amount to pledge.')
    .alias('h', 'help')
    .argv;
}

function listHelp(argv) {
  return argv.usage('Usage: $0 list <projectName>')
    .help('h')
    .example('$0 list Project_Sugar_Cube', 'List all pledges towards a given project.')
    .alias('h', 'help')
    .argv;
}

function backerHelp(argv) {
  return argv.usage('Usage: $0 backer <backerName>')
    .help('h')
    .example('$0 backer John', 'List all the projects a backer has contributed to.')
    .alias('h', 'help')
    .argv;
}

module.exports = {
  project: projectHelp,
  back: backHelp,
  list: listHelp,
  backer: backerHelp
};
