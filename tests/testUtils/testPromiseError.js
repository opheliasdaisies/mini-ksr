'use strict';

var expect = require('chai').expect;
var promiseErrorHandling = require('../../lib/utils/promiseErrorHandling');

function promiseIsExpectedError(promise, expectedMessage) {
  return promise
    .then(function(){
      expect(true).to.not.exist;
    })
    .catch(function(err) {
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal(expectedMessage);
    });
}

module.exports = promiseIsExpectedError;
