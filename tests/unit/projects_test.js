'use strict';

var projects = require('../../lib/controllers/project');
var chai = require('chai');
var expect = chai.expect;
var Promise = require('bluebird');

describe('A new project can be created with a project name and a target dollar amount.', function(){

  it ('Should return a promise that resolves to a new project', function(done) {
    var projectPromise = projects.createProject('A-Project', 200);
    expect(projectPromise.then).to.be.a('function');
    projectPromise.then(function(project){
      expect(project).to.be.an('object');
      expect(project.get('name')).to.equal('A-Project');
      done();
    });
  });

  it ('Should have an alphaneumeric name.'//, function() {
    // expect(projects.createProject('A Project', 20)).to.throw(Error);
    // var project = projects.createProject('A-Project', 20);
    // expect(project).to.be.an('object');
    // expect(project.name).to.equal('A-Project');
  // }
  );

  it ('Should have a name that is between 4 and 20 characters.');

  it ('Should have a target value that accepts dollars and cents.');

  it ('Should not preceed the target value with $');

});
