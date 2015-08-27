'use strict';

var expect = require('chai').expect;
var project = require('../../lib/controllers/project');

function createProjectAndCheckForError(projectName, target, errorMsg, t) {
  // create a new project with the specified arguments
  project.createProject(projectName, target)
  .then(function(createdProject){
    // if the project is created the test will fail.
    expect(createdProject).to.not.exist();
    t.end();
  })
  .catch(function(err){
    // checking to make sure the error matches the one expected for the test
    expect(err).to.be.an.instanceof(Error);
    expect(err.message).to.equal(errorMsg);
    t.end();
  });
}

module.exports = createProjectAndCheckForError;
