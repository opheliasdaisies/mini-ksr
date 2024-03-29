'use strict';

require('../testUtils/testConfig');

var tap = require('tap');
var setupDB = require('../testUtils/databaseSetupBeforeTest');
var chai = require('chai');
var expect = chai.expect;
var project = require('../../lib/controllers/project');
var pledge = require('../../lib/controllers/pledge');
var Pledge = require('../../lib/models/Pledge');
var createPledgeAndCheckForError = require('../testUtils/createPledgeAndCheckForError');
var sequelize = require('../../lib/utils/sequelize');

tap.test('Sync the tables in postgres. Must succeed for tests to run.', {bail: true}, function(t) {
  return sequelize.sync({force: true})
    .then(function(db) {
      t.ok(db, 'table setup must succeed');
      t.end();
    });
});

tap.test('Should be able to back a project with a pledge.', function(t) {
  setupDB()
    .then(function() {
      // Back a project
      return pledge.backProject('Thomas', 'Super-Project', '4111111111111111', 20);
    })
    .then(function(createdPledge) {
      expect(createdPledge).to.be.an('object');
      expect(createdPledge.backer).to.equal('Thomas');
      expect(createdPledge.creditCard).to.equal('4111111111111111');
      expect(Number(createdPledge.amount)).to.equal(20);

      // return the id of the created pledge to retrieve it.
      return createdPledge.id;
    })
    .then(function(pledgeId) {
      // find the created pledge
      return Pledge.findById(pledgeId);
    })
    .then(function(retrievedPledge) {
      // check if retrieved pledge matches the pledge created in test
      expect(retrievedPledge).to.be.an('object');
      expect(retrievedPledge.backer).to.equal('Thomas');
      expect(retrievedPledge.amount).to.equal('20');
      t.end();
    });
});

tap.test('Should not be able to back a project that doesn\'t exist.', function(t) {
  setupDB()
    .then(function() {
      var expectedMessage = 'You must supply the name of a valid project to back it.';
      // back a project that has not been created
      return createPledgeAndCheckForError('Jackelyn', 'OMG-A-Project', '146112832876245', 1000, expectedMessage);
    })
   .then(function() {
      t.end();
    });
});

tap.test('Should not be able to back a project if arguments are missing.', function(t) {
  setupDB()
    .then(function() {
      var expectedMessage = 'You must supply the dollar amount you want to put towards the project. Do not include a $ sign.';
      // back a project without a pledge amount.
      return createPledgeAndCheckForError('Jackelyn', 'Super-Project', '146112832876245', null, expectedMessage);
    })
   .then(function() {
      t.end();
    });
});

tap.test('Should only accept alphaneumeric characters, dashes, and underscores for the backer\'s name.', function(t) {
  setupDB()
    .then(function() {
      var expectedMessage = 'Backer names can only include alphaneumeric characters, dashes, and underscores.';
      // back a project with the backer name including invalid characters
      return createPledgeAndCheckForError('Not A Backer', 'Super-Project', '146112832876245', 1000, expectedMessage);
    })
   .then(function() {
      t.end();
    });
});

tap.test('Should only accept backer names 4 characters or longer.', function(t) {
  setupDB()
    .then(function() {
      var expectedMessage = 'Backer names must be longer than 3 characters.';
      // back a project with a short backer name
      return createPledgeAndCheckForError('Me', 'Super-Project', '146112832876245', 1000, expectedMessage);
    })
   .then(function() {
      t.end();
    });
});

tap.test('Should only accept backer names 20 characters or shorter.', function(t) {
  setupDB()
    .then(function() {
      var expectedMessage = 'Backer names can not be longer than 20 characters.';
      // back a project with a long backer name
      return createPledgeAndCheckForError('Everybody-Wants-To-Back-A-Project', 'Super-Project', '146112832876245', 1000, expectedMessage);
    })
   .then(function() {
      t.end();
    });
});

tap.test('Should only accept credit card numbers 19 characters or shorter.', function(t) {
  setupDB()
    .then(function() {
      var expectedMessage = 'Credit card numbers can not be longer than 19 characters.';
      // back a project with a long credit card
      return createPledgeAndCheckForError('Ida_Backer', 'Super-Project', '212121418472837192612491612', 1000, expectedMessage);
    })
   .then(function() {
      t.end();
    });
});

tap.test('Should only accept numeric credit cards.', function(t) {
  setupDB()
    .then(function() {
      var expectedMessage = 'Credit cards must contain only numeric characters.';
      // back a project with a credit card with invalid characters
      return createPledgeAndCheckForError('Ida_Backer', 'Super-Project', '871-802', 1000, expectedMessage);
    })
   .then(function() {
      t.end();
    });
});

tap.test('Should only accept credit cards that pass Luhn-10 validation.', function(t) {
  setupDB()
    .then(function() {
      var expectedMessage = 'Entered credit card number is invalid.';
      // back a project with a credit card that does not pass Luhn-10.
      return createPledgeAndCheckForError('Ida_Backer', 'Super-Project', '4111111111111112', 1000, expectedMessage);
    })
   .then(function() {
      t.end();
    });
});

tap.test('Should not accept a credit card that has already been used to back the project.', function(t) {
  setupDB()
    .then(function() {
      // Back 'Super-Project' with a credit card.
      return pledge.backProject('Shirley', 'Super-Project', '4111111111111111', 10);
    })
    .then(function() {
      // Create a new project.
      return project.createProject('Going-To-Mars', 500);
    })
    .then(function() {
      // Back new project with the same credit card
      return pledge.backProject('Steve', 'Going-To-Mars', '4111111111111111', 20);
    })
    .then(function(createdPledge) {
      // Expect new project to be backed successfully
      expect(createdPledge.backer).to.equal('Steve');
      expect(createdPledge.amount).to.equal('20');
    })
    .then(function() {
      var expectedMessage = 'That credit card has already been used. Please use a different credit card.'
      // Back 'Super-Project' again with the same credit card.'
      return createPledgeAndCheckForError('Steve', 'Super-Project', '4111111111111111', 200, expectedMessage);
    })
    .then(function() {
      t.end();
    });
});

tap.test('Should have a pledge value that accepts dollars and cents.', function(t) {
  setupDB()
    .then(function() {
      // Back a project with a pledge value with dollars and cents
      return pledge.backProject('Kimberly', 'Super-Project', '252449686234', 50.75);
    })
    .then(function(createdPledge) {
      expect(Number(createdPledge.amount)).to.equal(50.75);
      t.end();
    });
});

tap.test('Should not accept a pledge value preceeded by a $ sign.', function(t) {
  setupDB()
    .then(function() {
      var expectedMessage = 'You must enter a number for the amount of your pledge. Do not include a $ sign.';
      // back a project with $ preceeding the pledge value
      return createPledgeAndCheckForError('Kristopher', 'Super-Project', '4448356823556', '$500', expectedMessage);
    })
   .then(function() {
      t.end();
    });
});

tap.test('Should list all projects a backer has backed.', function(t) {
  setupDB()
    .then(function() {
      // Back 'Super-Project'.
      return pledge.backProject('Kristopher', 'Super-Project', '4111111111111111', 10);
    })
    .then(function() {
      // Create a new project.
      return project.createProject('Going-To-Mars', 500);
    })
    .then(function() {
      // Back new project.
      return pledge.backProject('Kristopher', 'Going-To-Mars', '4111111111111111', 20);
    })
    .then(function(createdPledge) {
      // List backer
      return pledge.listBacker('Kristopher');
    })
    .then(function(retrievedPledges) {
      expect(retrievedPledges).to.be.an('array');
      expect(retrievedPledges[0].project.name).to.equal('Super-Project');
      expect(retrievedPledges[1].project.name).to.equal('Going-To-Mars');
      expect(retrievedPledges[0].amount).to.equal('10');
      expect(retrievedPledges[1].amount).to.equal('20');
      t.end();
    });
});

tap.test('Close the connection to the database.', function() {
  sequelize.close();
});
