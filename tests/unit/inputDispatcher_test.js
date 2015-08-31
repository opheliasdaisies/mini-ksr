'use strict';

require('../testUtils/testConfig');

var tap = require('tap');
var setupDB = require('../testUtils/databaseSetupBeforeTest');
var chai = require('chai');
var expect = chai.expect;
var Project = require('../../lib/models/Project');
var Pledge = require('../../lib/models/Pledge');
var inputDispatcher = require('../../lib/cli/inputDispatcher');
var sequelize = require('../../lib/utils/sequelize');
var findExistingProjects = require('../../lib/utils/findExistingProject');

tap.test('Sync the tables in postgres. Must succeed for tests to run.', {bail: true}, function(t) {
  return sequelize.sync({force: true})
    .then(function(db) {
      t.ok(db, 'table setup must succeed');
      t.end();
    });
});

tap.test('Should be able to create a project.', function(t) {
  setupDB()
    .then(function() {
      return inputDispatcher('project', ['Project-Of-Cool', 926000]);
    })
    .then(function() {
      return findExistingProjects('Project-Of-Cool');
    })
    .then(function(project){
      expect(project.name).to.equal('Project-Of-Cool');
      t.end();
    });
});

tap.test('Should be able to back a project.', function(t) {
  setupDB()
    .then(function() {
      return inputDispatcher('back', ['Julia', 'Super-Project', 505050505057237, 20]);
    })
    .then(function() {
      return Pledge.findOne({
        where: {
          backer: 'Julia'
        },
        include: Project
      });
    })
    .then(function(pledge){
      expect(pledge.backer).to.equal('Julia');
      expect(pledge.project.name).to.equal('Super-Project');
      expect(pledge.creditCard).to.equal('505050505057237');
      expect(pledge.amount).to.equal('20');
      t.end();
    });
});

tap.test('Close the connection to the database.', function() {
  sequelize.close();
});
