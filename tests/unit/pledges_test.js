'use strict';

var chai = require('chai');
var expect = chai.expect;
var project = require('../../lib/controllers/project');
var pledge = require('../../lib/controllers/pledge');
var Project = require('../../lib/models/Project');
var Pledge = require('../../lib/models/Pledge');
var promiseErrorHandling = require('../../lib/utils/promiseErrorHandling');
var promiseIsExpectedError = require('../testUtils/testPromiseError');

describe('Backers are able to contribute to a project.', function() {

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

  it ('Should return a promise that resovles to a pledge.', function() {
    return pledge.backProject('Thomas', 'Super-Project', 12345, 20)
      .then(function(pledge) {
        expect(pledge).to.be.an('object');
        expect(pledge.get('backer')).to.equal('Thomas');
        expect(Number(pledge.get('creditCard'))).to.equal(12345);
        expect(Number(pledge.get('amount'))).to.equal(20);
        return pledge.get('id');
      })
      .then(function(pledgeId) {
        return Pledge.findById(pledgeId);
      })
      .then(function(pledge){
        expect(pledge).to.be.an('object');
      });
  });

  it ('Should return a promise that resovles to an error if the project doesn\'t exist.', function() {
    var pledgePromise = pledge.backProject('Jackelyn', 'OMG-A-Project', 12345, 1000);
    var expectedError = 'You must supply the name of a valid project to back it.';
    return promiseIsExpectedError(pledgePromise, expectedError);
  });

  it ('Should return a promise that resovles to an error if arguments are missing.', function() {
    var pledgePromise = pledge.backProject('Jackelyn', 'Super-Project', 50);
    var expectedError = 'You must supply the dollar amount you want to put towards the project.';
    return promiseIsExpectedError(pledgePromise, expectedError);
  });

  it ('Should return a promise that resoves to an error if backer name includes invalid characters.', function() {
    var pledgePromise = pledge.backProject('Not A Backer', 'Super-Project', 12345, 1000);
    var expectedError = 'Backer names can only include alphaneumeric characters, dashes, and underscores.';
    return promiseIsExpectedError(pledgePromise, expectedError);
  });

  it ('Should return a promise that resolves to an error if the backer\'s name is less than 4 characters', function() {
    var pledgePromise = pledge.backProject('Me', 'Super-Project', 12345, 1000);
    var expectedError = 'Backer names must be longer than 3 characters.';
    return promiseIsExpectedError(pledgePromise, expectedError);
  });

  it ('Should return a promise that resolves to an error if the backer\'s name is more than 20 characters', function() {
    var pledgePromise = pledge.backProject('Everybody-Wants-To-Back-A-Project', 'Super-Project', 12345, 1000);
    var expectedError = 'Backer names can not be longer than 20 characters.';
    return promiseIsExpectedError(pledgePromise, expectedError);
  });

  it ('Should return a promise that ')

});


// * Credit card numbers may vary in length, up to 19 characters.
// * Credit card numbers will always be numeric.
// * Card numbers should be validated using Luhn-10.
// * Cards that fail Luhn-10 will display an error.
// * Cards that have already been added will display an error.
// * Backing dollar amounts should accept both dollars and cents.
// * Backing dollar amounts should NOT use the $ currency symbol to avoid issues with shell escaping.
