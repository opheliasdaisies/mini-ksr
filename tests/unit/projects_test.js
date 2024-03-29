'use strict';

require('../testUtils/testConfig');

var tap = require('tap');
var setupDB = require('../testUtils/databaseSetupBeforeTest');
var chai = require('chai');
var expect = chai.expect;
var project = require('../../lib/controllers/project');
var pledge = require('../../lib/controllers/pledge');
var createProjectAndCheckForError = require('../testUtils/createProjectAndCheckForError');
var findExistingProject = require('../../lib/utils/findExistingProject');
var sequelize = require('../../lib/utils/sequelize');

tap.test('Sync the tables in postgres. Must succeed for tests to run.', {bail: true}, function(t) {
  return sequelize.sync({force: true})
    .then(function(db) {
      t.ok(db, 'table setup must succeed');
      t.end();
    });
});

tap.test('Should be able to create a new project', function(t) {
  setupDB()
    .then(function() {
      // create a new project
      return project.createProject('A-Project', 200);
    })
    .then(function(createdProject) {
      expect(createdProject).to.be.an('object');
      expect(createdProject.name).to.equal('A-Project');

      // retrieve created project from db
      return findExistingProject('A-Project');
    })
    .then(function(retrievedProject) {
      // make sure correct project was retrieved
      expect(retrievedProject).to.be.an('object');
      expect(retrievedProject.name).to.equal('A-Project');
      t.end();
    });
});

tap.test('Should only allow project names to have alphaneumeric characters, dashes, and underscores.', function(t) {
  setupDB()
    .then(function() {
      var expectedMessage = 'Project names can only include alphaneumeric characters, dashes, and underscores.';
      // create a new project with invalid characters
      return createProjectAndCheckForError('Project-%', 200, expectedMessage);
    })
    .then(function() {
      t.end();
    });
});

tap.test('Should only allow projects with names 4 characters or longer.', function(t) {
  setupDB()
    .then(function() {
      var expectedMessage = 'Your project name must be longer than 3 characters.';
      // create a new project with a too-short name
      return createProjectAndCheckForError('The', 500, expectedMessage);
    })
   .then(function() {
      t.end();
    });
});

tap.test('Should only allow projects with names 20 characters or shorter.', function(t){
  setupDB()
    .then(function() {
      var expectedMessage = 'Your project name can not be longer than 20 characters.';
      // create a new project with a too-long name
      return createProjectAndCheckForError('The_Greatest_Project_To_Ever_Exist', 5000000000, expectedMessage);
    })
   .then(function() {
      t.end();
    });
});

tap.test('Should only allow projects that have a target value.', function(t) {
  setupDB()
    .then(function() {
      var expectedMessage = 'You must supply a target value for your project.';
      // create a new project with no target
      return createProjectAndCheckForError('Our-Project', null, expectedMessage);
    })
   .then(function() {
      t.end();
    });
});

tap.test('Should have a target value that accepts dollars and cents.', function(t) {
  setupDB()
    .then(function() {
      // create a new project with a decimal in the target
      return project.createProject('Total_New_Project', 100.25);
    })
    .then(function(createdProject) {
      // make sure created project has correct value
      expect(createdProject.target).to.equal('100.25');
      t.end();
    });
});

tap.test('Should not allow target to be preceeded by a $', function(t) {
  setupDB()
    .then(function() {
      var expectedMessage = 'You must enter a number for your project\'s target. Do not include a $ sign.';
      // create a new project with a dollar sign before the target value
      return createProjectAndCheckForError('MoneyProject', '$500', expectedMessage);
    })
   .then(function() {
      t.end();
    });
});

tap.test('Should not allow a project to be created if the project name already exists.', function(t) {
  setupDB()
    .then(function() {
      var expectedMessage = 'A project with the name Super-Project already exists. Please try another name.';
      // create a new project with a name of an already-existing project
      return createProjectAndCheckForError('Super-Project', 200000, expectedMessage);
    })
   .then(function() {
      t.end();
    });
});

tap.test('Should list all pledges towards a specified project.', function(t) {
  setupDB()
    .then(function() {
      // back the project 'Super-Project', which is created in setupDB
      return pledge.backProject('Mary', 'Super-Project', '9145210', 20)
    })
    .then(function() {
      // make a second pledge towards 'Super-Project'
      return pledge.backProject('Timothy', 'Super-Project', '6796551', 50);
    })
    .then(function() {
      // call the listProject function
      return project.listProject('Super-Project');
    })
    .then(function(project) {
      expect(project.name).to.equal('Super-Project');
      expect(project.pledges).to.be.an('array');
      expect(project.pledges.length).to.equal(2);
      expect(project.pledges[0].backer).to.equal('Mary');
      t.end();
    });
});

tap.test('Close the connection to the database.', function() {
  sequelize.close();
});
