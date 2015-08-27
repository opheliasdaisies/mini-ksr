'use strict';

require('../testUtils/testConfig');

var tap = require('tap');
var setupDB = require('../testUtils/databaseSetupBeforeTest');
var chai = require('chai');
var expect = chai.expect;
var project = require('../../lib/controllers/project');
var pledge = require('../../lib/controllers/pledge');
var findExistingProject = require('../../lib/utils/findExistingProject');

tap.test('Should be able to create a new project', function(t) {
  setupDB()
    .then(function(){
      // create a new project
      return project.createProject('A-Project', 200);
    })
    .then(function(createdProject){
      expect(createdProject).to.be.an('object');
      expect(createdProject.get('name')).to.equal('A-Project');

      // retrieve created project from db
      return findExistingProject('A-Project');
    })
    .then(function(retrievedProject){
      // make sure correct project was retrieved
      expect(retrievedProject).to.be.an('object');
      expect(retrievedProject.get('name')).to.equal('A-Project');
      t.end();
    });
});

tap.test('Should only allow project names to have alphaneumeric characters, dahses, and underscores.', function(t) {
  setupDB()
    .then(function(){
      // create a new project with invalid characters
      return project.createProject('Project-%', 200);
    })
    .then(function(createdProject){
      // if the project is created the test will fail.
      expect(createdProject).to.not.exist();
      t.end();
    })
    .catch(function(err){
      var expectedMessage = 'Project names can only include alphaneumeric characters, dashes, and underscores.';
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal(expectedMessage);
      t.end();
    });
});

tap.test('Should only allow projects with names 4 characters or longer.', function(t) {
  setupDB()
    .then(function() {
      // create a new project with a too-short name
      return project.createProject('The', 500);
    })
   .then(function(createdProject){
      // if the project is created the test will fail.
      expect(createdProject).to.not.exist();
      t.end();
    })
    .catch(function(err){
      var expectedMessage = 'Your project name must be longer than 3 characters.';
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal(expectedMessage);
      t.end();
    });
});

tap.test('Should only allow projects with names 20 characters or shorter.', function(t){
  setupDB()
    .then(function() {
      // create a new project with a too-short name
      return project.createProject('The_Greatest_Project_To_Ever_Exist', 5000000000);
    })
   .then(function(createdProject){
      // if the project is created the test will fail.
      expect(createdProject).to.not.exist();
      t.end();
    })
    .catch(function(err){
      var expectedMessage = 'Your project name can not be longer than 20 characters.';
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal(expectedMessage);
      t.end();
    });
});

tap.test('Should only allow projects that have a target value.', function(t){
  setupDB()
    .then(function() {
      // create a new project with no target
      return project.createProject('Our-Project');
    })
   .then(function(createdProject){
      // if the project is created the test will fail.
      expect(createdProject).to.not.exist();
      t.end();
    })
    .catch(function(err){
      var expectedMessage = 'You must supply a target value for your project.';
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal(expectedMessage);
      t.end();
    });
});

tap.test('Should have a target value that accepts dollars and cents.', function(t){
  setupDB()
    .then(function(){
      // create a new project with a decimal in the target
      return project.createProject('Total_New_Project', 100.25);
    })
    .then(function(createdProject){
      // make sure created project has correct value
      expect(createdProject.get('target')).to.equal('100.25');
      t.end();
    });
});

tap.test('Should not allow target to be preceeded by a $', function(t) {
  setupDB()
    .then(function() {
      // create a new project with a dollar sign before the target value
      return project.createProject('MoneyProject', '$500');
    })
   .then(function(createdProject){
      // if the project is created the test will fail.
      expect(createdProject).to.not.exist();
      t.end();
    })
    .catch(function(err){
      var expectedMessage = 'You must enter a number for your project\'s target. Do not include a $ sign.';
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal(expectedMessage);
      t.end();
    });
});

tap.test('Should not allow a project to be created if the project name already exists.', function(t) {
  setupDB()
    .then(function() {
      // create a new project with a name of an already-existing project
      return project.createProject('Super-Project', 200000);
    })
   .then(function(createdProject){
      // if the project is created the test will fail.
      expect(createdProject).to.not.exist();
      t.end();
    })
    .catch(function(err){
      var expectedMessage = 'A project with the name Super-Project already exists. Please try another name.';
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal(expectedMessage);
      t.end();
    });
});

tap.test('Should list all pledges towards a specified project.', function(t) {
  setupDB()
    .then(function(){
      // back the project 'Super-Project', which is created in setupDB
      pledge.backProject('Mary', 'Super-Project', '9145210', 20)
    })
    .then(function(){
      // make a second pledge towards 'Super-Project'
      return pledge.backProject('Timothy', 'Super-Project', '6796551', 50);
    })
    .then(function(){
      // call the listProject function
      return project.listProject('Super-Project');
    })
    .then(function(project){
      expect(project.get('name')).to.equal('Super-Project');
      expect(project.get('pledges')).to.be.an('array');
      expect(project.get('pledges').length).to.equal(2);
      expect(project.get('pledges')[0].backer).to.equal('Mary');
      t.end();
    });
});
