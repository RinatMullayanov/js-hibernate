module.exports = function(grunt) {
	grunt.initConfig({
		jshint: {
			all: ['./*.js', 'test/**/*.js'],
			options: {
				globals: {
					_: false,
					$: false,
					jasmine: false,
					describe: false,
					it: false,
					expect: false,
					beforeEach: false
				},
				browser: true,
				devel: true
			}
		},
		testem: {
			unit: {
				options: {
					framework: 'jasmine2',
					launch_in_dev: ['PhantomJS'],
					before_test: 'grunt jshint',
					serve_files: [
						'index.js',						
						'test/**/*.js'
					],
					watch_files: [
						'./*.js',
						'test/**/*.js'
					]
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-testem');

	grunt.registerTask('default', ['testem:run:unit']);
};