'use strict';

module.exports = function (grunt) {

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
    },

    jsbeautifier: {
      files: projectFiles,
      options: {
        config: '.jsbeautifyrc'
      }
    },

    mochaTest: {
      test: {
        src: ['tests/**/*.js'],
        options: {
          require: './tests/testUtils/testConfig.js'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-jsbeautifier');

  grunt.registerTask('default', ['jsbeautifier', 'jshint', 'jscs']);
  grunt.registerTask('test', 'mochaTest');

};
