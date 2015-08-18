'use strict';

var chai = require('chai');
var expect = chai.expect;
var bookshelf = require('../../lib/utils/bookshelf');
var project = require('../../lib/controllers/project');
var pledge = require('../../lib/controllers/pledge');
var Pledge = require('../../lib/models/Pledge');

describe('Backers are able to contribute to a project.', function() {

  // before(function(done){
  //   project.createProject('Super-Project', 2000)
  //     .then(function() {
  //       done();
  //     });
  // })

  // after(function(done){
  //   bookshelf.knex.raw('truncate pledges')
  //     .then(function(){
  //       bookshelf.knex.raw('truncate projects')
  //     })
  //     .then(function(){
  //       done();
  //     });

  // });

  it ('Should return a promise that resovles to a pledge.', function(done) {

      var pledgePromise = pledge.backProject('Tom', 'Super-Project', 12345, 20)
        .then(function(pledge) {
          expect(pledge).to.be.an('object');
          expect(pledge.get('backer')).to.equal('Tom');
          expect(pledge.get('creditCard')).to.equal(12345);
          expect(pledge.get('amount')).to.equal(20);
          return pledge.get('id');
        })
        .then(function(pledgeId) {
          return new Pledge({id: pledgeId})
            .fetch()
            .then(function(pledge){
              expect(pledge).to.exist;
            });
        })
        .then(function() {
          done();
        });
  });

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
