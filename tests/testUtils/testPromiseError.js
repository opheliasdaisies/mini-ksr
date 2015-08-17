'use strict';

var expect = require('chai').expect;

function promiseIsExpectedError(promise, expectedMessage, done) {
  return promise
  .then(function(){
    expect(true).to.not.exist;
    if (done){
      done();
    }
  })
  .catch(function(err) {
    expect(err).to.be.an.instanceof(Error);
    expect(err.message).to.equal(expectedMessage);
    if (done) {
      done();
    }
  });
}

module.exports = promiseIsExpectedError;
