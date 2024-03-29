'use strict';

module.exports = function (grunt) {

  var projectFiles = ['GruntFile.js', 'lib/**/*.js', 'test/**/*.js', 'config/**/*.js'];

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
    },

    jsbeautifier: {
      files: projectFiles,
      options: {
        config: '.jsbeautifyrc'
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-jsbeautifier');

  grunt.registerTask('default', ['jsbeautifier', 'jshint', 'jscs']);

};
