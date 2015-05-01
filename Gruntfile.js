/* jshint node: true */
'use strict';
module.exports = function(grunt) {
  grunt.initConfig({
    jscs: {
      main: ['Gruntfile.js', '*.js']
    },
    jshint: {
      options: {
        jshintrc: true
      },
      files: {
        src: ['Gruntfile.js', '*.js']
      }
    }
  });
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('default', ['lint']);
  grunt.registerTask('lint', ['jscs', 'jshint']);
};
