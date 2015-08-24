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
    return pledge.backProject('Thomas', 'Super-Project', '4111111111111111', 20)
      .then(function(pledge) {
        expect(pledge).to.be.an('object');
        expect(pledge.get('backer')).to.equal('Thomas');
        expect(pledge.get('creditCard')).to.equal('4111111111111111');
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

  it ('Should return a promise that rejects with an error if the project doesn\'t exist.', function() {
    var pledgePromise = pledge.backProject('Jackelyn', 'OMG-A-Project', '4111111111111111', 1000);
    var expectedError = 'You must supply the name of a valid project to back it.';
    return promiseIsExpectedError(pledgePromise, expectedError);
  });

  it ('Should return a promise that rejects with an error if arguments are missing.', function() {
    var pledgePromise = pledge.backProject('Jackelyn', 'Super-Project', '4111111111111111');
    var expectedError = 'You must supply the dollar amount you want to put towards the project.';
    return promiseIsExpectedError(pledgePromise, expectedError);
  });

  it ('Should return a promise that rejects with an error if backer name includes invalid characters.', function() {
    var pledgePromise = pledge.backProject('Not A Backer', 'Super-Project', '4111111111111111', 1000);
    var expectedError = 'Backer names can only include alphaneumeric characters, dashes, and underscores.';
    return promiseIsExpectedError(pledgePromise, expectedError);
  });

  it ('Should return a promise that rejects with an error if the backer\'s name is less than 4 characters', function() {
    var pledgePromise = pledge.backProject('Me', 'Super-Project', '4111111111111111', 1000);
    var expectedError = 'Backer names must be longer than 3 characters.';
    return promiseIsExpectedError(pledgePromise, expectedError);
  });

  it ('Should return a promise that rejects with an error if the backer\'s name is more than 20 characters', function() {
    var pledgePromise = pledge.backProject('Everybody-Wants-To-Back-A-Project', 'Super-Project', '4111111111111111', 1000);
    var expectedError = 'Backer names can not be longer than 20 characters.';
    return promiseIsExpectedError(pledgePromise, expectedError);
  });

  it ('Should return a promise that rejects with an error if credit card numbers are longer than 19 characters.', function() {
    var pledgePromise = pledge.backProject('Ida_Backer', 'Super-Project', '212121418472837192612491612', 1000);
    var expectedError = 'Credit card numbers can not be longer than 19 characters.';
    return promiseIsExpectedError(pledgePromise, expectedError);
  });

  it ('Should return a promise that rejects with an error if credit card numbers are not numeric.', function() {
    var pledgePromise = pledge.backProject('Ida_Backer', 'Super-Project', '871 802', 1000);
    var expectedError = 'Credit cards must contain only numeric characters.';
    return promiseIsExpectedError(pledgePromise, expectedError);
  });

  it ('Should return a promise that rejects with an error if credit card numbers do not pass Luhn-10 validation.', function() {
    var pledgePromise = pledge.backProject('Ida_Backer', 'Super-Project', '4111111111111112', 1000);
    var expectedError = 'Entered credit card number is invalid.';
    return promiseIsExpectedError(pledgePromise, expectedError);
  });

  it ('Should return a promise that rejects with an error if the credit card number entered has already been used.');

  it ('Should have a pledge value that accepts dollars and cents.');

  it ('Should return a promise that rejects with an error if the target is preceeded with $');

});
