'use strict';

module.exports = function(grunt){

  var projectFiles = ['GruntFile.js', 'lib/**/*.js', 'test/**/*.js'];

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: projectFiles,
      options: {
        jshintrc: '.jshintrc'
      }
    },

    jscs: {
      files: projectFiles,
      options: {
        config: '.jscsrc'
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');

  grunt.registerTask('default', ['jshint', 'jscs']);

};
