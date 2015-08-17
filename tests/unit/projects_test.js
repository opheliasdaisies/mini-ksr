'use strict';

var chai = require('chai');
var expect = chai.expect;
var _ = require('underscore');
var Promise = require('bluebird');
var Project = require('../../lib/models/Project');
var projects = require('../../lib/controllers/project');
var promiseIsExpectedError = require('../testUtils/testPromiseError');
var bookshelf = require('../../lib/utils/bookshelf');

describe('A new project can be created with a project name and a target dollar amount.', function(){

  afterEach(function(done){
    bookshelf.knex.raw('truncate projects')
      .then(function(){
        done();
      });

  });

  it ('Should return a promise that resolves to a new project', function(done) {
    var projectPromise = projects.createProject('A-Project', 200);
    expect(projectPromise.then).to.be.a('function');
    projectPromise.then(function(project){
      expect(project).to.be.an('object');
      expect(project.get('name')).to.equal('A-Project');
      done();
    });
  });

  it ('Should return a promise that resolves to an error if the project\'s name includes invalid characters.', function(done) {
    var projectPromise = projects.createProject('Project-%', 200);
    var expectedError = 'Project names can only include alphaneumeric characters, dashes, and underscores.';
    promiseIsExpectedError(projectPromise, expectedError, done);
  });

  it ('Should return a promise that resolves to an error if the project\'s name is less than 4 characters.', function(done) {
    var projectPromise = projects.createProject('The', 500);
    var expectedError = 'Your project name must be longer than 3 characters.';
    promiseIsExpectedError(projectPromise, expectedError, done);
  });

  it ('Should return a promise that resolves to an error if the project\'s name is more than 20 characters.', function(done) {
    var projectPromise = projects.createProject('The_Greatest_Project_To_Ever_Exist', 5000000000);
    var expectedError = 'Your project name can not be longer than 20 characters.';
    promiseIsExpectedError(projectPromise, expectedError, done);
  });

  it ('Should return a promise that resolves to an error if the target is not given.', function(done) {
    var projectPromise = projects.createProject('Our-Project');
    var expectedError = 'You must supply a target value for your project.';
    promiseIsExpectedError(projectPromise, expectedError, done);
  });

  it ('Should have a target value that accepts dollars and cents.', function(done) {
    var projectPromise = projects.createProject('Our-Project', 100.25);
    projectPromise.then(function(project){
      expect(project.get('target')).to.equal(100.25);
      done();
    });
  });

  it ('Should return a promise taht resolves to an error if the target is preceeded with $', function(done) {
    var projectPromise = projects.createProject('MoneyProject', '$500');
    var expectedError = 'You must enter a number for your project\'s target. Do not include a $ sign.';
    promiseIsExpectedError(projectPromise, expectedError, done);
  });

});