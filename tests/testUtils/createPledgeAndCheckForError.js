'use strict';

var expect = require('chai').expect;
var pledge = require('../../lib/controllers/pledge');

// Create a pledge with invalid arguments. Expect it to result in an error.
function createPledgeAndCheckForError(backer, project, creditCard, amount, expectedMessage) {
  // Attempt to create a pledge
  return pledge.backProject(backer, project, creditCard, amount)
   .then(function(createdPledge) {
      // if the pledge is created the test will fail.
      expect(createdPledge).to.not.exist();
    })
    .catch(function(err) {
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal(expectedMessage);
    });
}

module.exports = createPledgeAndCheckForError;
