module.exports = function(grunt) {

  grunt.initConfig({
    concurrent: {
      dev: ['shell:serve', 'shell:build']
    },
    shell: {
      serve: {
        command: 'cd server && nodemon server/index.js'
      },
      build: {
        command: 'cd app && npm start'
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', [ 'concurrent:dev' ]);
};