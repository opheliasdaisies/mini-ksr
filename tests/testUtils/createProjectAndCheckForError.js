'use strict';

var expect = require('chai').expect;
var project = require('../../lib/controllers/project');

// Create a project with invalid arguments. Expect it to result in an error.
function createProjectAndCheckForError(name, target, expectedMessage) {
  // Attempt to create project
  return project.createProject(name, target)
    .then(function(createdProject) {
      // if the project is created the test will fail.
      expect(createdProject).to.not.exist();
    })
    .catch(function(err) {
      // Expect a specific error to be returned.
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal(expectedMessage);
    });
}

module.exports = createProjectAndCheckForError;
