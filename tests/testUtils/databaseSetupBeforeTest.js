'use strict';

var sequelize = require('../../lib/utils/sequelize');
var project = require('../../lib/controllers/project');

function setupDatabases(){
  return sequelize.truncate({cascade: true})
    .then(function(){
      return project.createProject('Super-Project', 2000);
    });
}

module.exports = setupDatabases;
