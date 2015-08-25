'use strict';

var chai = require('chai');
var expect = chai.expect;
var _ = require('underscore');
var Promise = require('bluebird');
var Project = require('../../lib/models/Project');
var Pledge = require('../../lib/models/Pledge');
var project = require('../../lib/controllers/project');
var pledge = require('../../lib/controllers/pledge');
var findExistingProject = require('../../lib/utils/findExistingProject');
var promiseIsExpectedError = require('../testUtils/testPromiseError');

describe('A new project can be created with a project name and a target dollar amount.', function(){

  before(function(){
    return Project.sync()
      .then(function(){
        return project.createProject('Super-Project', 2000)
      }).then(function(){
        Pledge.sync();
      });
  });

  after(function(){
    return Project.drop({cascade:true})
      .then(function(){
        Pledge.drop({cascade:true})
      });
  });

  it ('Should return a promise that resolves to a new project', function() {
    var projectPromise = project.createProject('A-Project', 200);
    expect(projectPromise.then).to.be.a('function');
    return projectPromise
      .then(function(project){
        expect(project).to.be.an('object');
        expect(project.get('name')).to.equal('A-Project');
      })
      .then(function(){
        return findExistingProject('A-Project');
      })
      .then(function(retrievedProject){
        expect(retrievedProject).to.be.an('object');
      });
  });

  it ('Should return a promise that rejects with an error if the project\'s name includes invalid characters.', function() {
    var projectPromise = project.createProject('Project-%', 200);
    var expectedError = 'Project names can only include alphaneumeric characters, dashes, and underscores.';
    return promiseIsExpectedError(projectPromise, expectedError);
  });

  it ('Should return a promise that rejects with an error if the project\'s name is less than 4 characters.', function() {
    var projectPromise = project.createProject('The', 500);
    var expectedError = 'Your project name must be longer than 3 characters.';
    return promiseIsExpectedError(projectPromise, expectedError);
  });

  it ('Should return a promise that rejects with an error if the project\'s name is more than 20 characters.', function() {
    var projectPromise = project.createProject('The_Greatest_Project_To_Ever_Exist', 5000000000);
    var expectedError = 'Your project name can not be longer than 20 characters.';
    return promiseIsExpectedError(projectPromise, expectedError);
  });

  it ('Should return a promise that rejects with an error if the target is not given.', function() {
    var projectPromise = project.createProject('Our-Project');
    var expectedError = 'You must supply a target value for your project.';
    return promiseIsExpectedError(projectPromise, expectedError);
  });

  it ('Should have a target value that accepts dollars and cents.', function() {
    var projectPromise = project.createProject('Total_New_Project', 100.25);
      return projectPromise.then(function(project){
      expect(Number(project.get('target'))).to.equal(100.25);
    });
  });

  it ('Should return a promise that rejects with an error if the target is preceeded with $', function() {
    var projectPromise = project.createProject('MoneyProject', '$500');
    var expectedError = 'You must enter a number for your project\'s target. Do not include a $ sign.';
    return promiseIsExpectedError(projectPromise, expectedError);
  });

  it ('Should return a promise that rejects with an error if the project name already exists', function() {
      var projectPromise = project.createProject('A-Project', 200000);
      var expectedError = 'A project with the name A-Project already exists. Please try another name.'
      return promiseIsExpectedError(projectPromise, expectedError);
  });

  it ('Should return a promise that resolves to a list of all projects and associated pledges.', function() {
    return pledge.backProject('Mary', 'A-Project', '9145210', 20)
      .then(function(){
        return pledge.backProject('Timothy', 'A-Project', '6796551', 50);
      })
      .then(function(){
        return project.listProject('A-Project');
      })
      .then(function(project){
        console.log(project.pledges);
        expect(project.get('name')).to.equal('A-Project');
        expect(project.get('pledges')).to.be.an('array');
        expect(project.get('pledges').length).to.equal(2);
        expect(project.get('pledges')[0].backer).to.equal('Mary');
      });
  });

});
