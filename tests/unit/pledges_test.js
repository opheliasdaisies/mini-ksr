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
    return pledge.backProject('Tom', 'Super-Project', 12345, 20)
      .then(function(pledge) {
        expect(pledge).to.be.an('object');
        expect(pledge.get('backer')).to.equal('Tom');
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

  // it ('Should return a promise that resovles to an error if the project doesn\'t exist.', function() {

  //   // var pledgePromise = pledge.backProject('Jackelyn', 'OMG-A-Project', 12345, 1000);
  //   // var expectedError = 'That project cannot be found.';
  //   // return promiseIsExpectedError(pledgePromise, expectedError);

  // });

  // it ('Should return a promise that resovles to an error if arguments are missing.');

});


// **2.** The `back` input will back a project with a given name of the
// backer, the project to be backed, a credit card number and a backing
// dollar amount.

// ~~~
// back <given name> <project> <credit card number> <backing amount>
// ~~~

// * Given names should be alphanumeric and allow underscores or dashes.
// * Given names should be no shorter than 4 characters but no longer than
//   20 characters.
// * Credit card numbers may vary in length, up to 19 characters.
// * Credit card numbers will always be numeric.
// * Card numbers should be validated using Luhn-10.
// * Cards that fail Luhn-10 will display an error.
// * Cards that have already been added will display an error.
// * Backing dollar amounts should accept both dollars and cents.
// * Backing dollar amounts should NOT use the $ currency symbol to avoid issues with shell escaping.
