/*jshint camelcase:false */

module.exports = function(grunt) {

  // Load all grunt tasks matching the 'grunt-*' pattern
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    env: {
      test: {
        NODE_ENV: 'TEST'
      },
      coverage: {
        NODE_ENV: 'COVERAGE'
      }
    },
    cafemocha: {
      test: {
        src: 'test/*.js',
        options: {
          ui: 'bdd',
          reporter: 'spec'
        }
      },
      coverage: {
        src: 'test/*.js',
        options: {
          ui: 'bdd',
          reporter: 'html-cov',
          coverage: {
            output: 'coverage.html'
          }
        }
      }
    },
    jscoverage: {
      options: {
        inputDirectory: 'lib',
        outputDirectory: 'lib-cov',
        highlight: false
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['lib/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        camelcase: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        // NOTE Suppressing this warning allows us to write
        // single-line conditionals for compact error-handling
        '-W116': true,
        globals: {
          jQuery: true,
          require: true,
          __dirname: true,
          __filename: true,
          console: true,
          module: true,
          exports: true,
          process: true,
          describe: true,
          it: true,
          before: true,
          beforeEach: true,
          after: true,
          afterEach: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'qunit']
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('test', ['env:test', 'cafemocha:test']);
  grunt.registerTask('coverage', ['env:coverage', 'jscoverage', 'cafemocha:coverage']);

};
