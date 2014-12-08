//Gruntfile
module.exports = function(grunt) {

  // requirejs compile options
  var compileOptions = {

      mainConfigFile: 'client/js/main.js',
      baseUrl: 'client/js',
      include: ['main'],
      out: 'client/js/main.built.js',
      removeCombined: false,
      findNestedDependencies: true,
      optimize: 'none',
      wrapShim: true,
      almond: true,
//      cjsTranslate: true,

      //Removes console.logs for production
/*
      onBuildWrite: function (moduleName, path, contents) {
          if(/(.*)js\/modules\/(.*)/.test(path)) return contents.replace(/console.log(.*);/g, ';');
          return contents;
      }
*/


  };

  //Initializing the configuration object
  grunt.initConfig({

    // Task configuration
    requirejs: {
        compile: {
            options : compileOptions
        }
    },

    jshint: {
    	options: {
	    node: true
      	},
	all: [
	    'Gruntfile.js',
	    //'!src/main/webapp/js/lib/**/*.js',
	    'client/js/app/**/*.js',
            '!client/js/main.built.js',
	    '!client/js/_lib/**/*.*',
	    '!client/js/lib/**/*.*'
        ]
    },

    watch: {
        requirejs: {
            // Watch only main.js so that we do not constantly recompile the .js files
            files: [ 'client/js/main.js' ],
            tasks: [ 'requirejs' ],
            // Reloads the browser
            options: {
              livereload: true
            }
        }
    },

  });

  // Plugin loading
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Task definition
  grunt.registerTask('default', ['watch']);

};
