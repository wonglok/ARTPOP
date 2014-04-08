// Generated on 2014-04-01 using generator-angular 0.8.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);
  //
  //
  //

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-exec');
  //grunt.loadNpmTasks('grunt-open');b
  // Define the configuration for all the tasks
  grunt.initConfig({


    ngtemplates: {
      shaders: {
        cwd:        'app/',
        src:        'shaders/**.*',
        dest:       'app/scripts/ngTemplates/shaders.js',
        options: {
          bootstrap: function bootstrap(module, script) {
            var moduleName = require('./bower.json').name || 'lok';
            var str = '';
            str += 'angular.module(\''+ moduleName +'App\').run([\'$templateCache\', function($templateCache) {';
            str += '  \'use strict\';';
            str += script;
            str += '}]);';
            return str;
          },
          prefix: '',
          htmlmin:{
            collapseBooleanAttributes:      false,
            collapseWhitespace:             false,
            removeAttributeQuotes:          false,
            removeComments:                 false,
            removeEmptyAttributes:          false,
            removeRedundantAttributes:      false,
            removeScriptTypeAttributes:     false,
            removeStyleLinkTypeAttributes:  false
          }
        }
      },
      templates: {
        //because of usemin.
        //uses the dist's view to build app's tempalteCache.

        //dev mode
        //does not include.

        //get templates from last build
        //prodction mode
        //might get old version.
        cwd:        'dist/',
        src:        'views/**.html',
        dest:       'app/scripts/ngTemplates/templates.js',
        options: {
          bootstrap: function bootstrap(module, script) {
            var moduleName = require('./bower.json').name || 'lok';
            var str = '';
            str += 'angular.module(\''+ moduleName +'App\').run([\'$templateCache\', function($templateCache) {';
            str += '  \'use strict\';';
            str += script;
            str += '}]);';
            return str;
          },
          prefix: '',
          htmlmin:{
            collapseBooleanAttributes:      false,
            collapseWhitespace:             true,
            removeAttributeQuotes:          false,
            removeComments:                 false,
            removeEmptyAttributes:          false,
            removeRedundantAttributes:      false,
            removeScriptTypeAttributes:     false,
            removeStyleLinkTypeAttributes:  false
          }
        }
      },
    },

    //grunt.loadNpmTasks('grunt-gh-pages');
    'gh-pages': {
      dist:{
        //http://wonglok.github.io/FrameBudget.js/
        options: {
          user: {
            name: 'Wong Lok',
            email: 'wonglok@wonglok.com'
          },
          repo: 'git@github.com:wonglok/ARTPOP.git',
          base: 'dist'
        },
        src: ['**']
      }
    },
    //http://apwgl.192.168.0.120.xip.io:9000/
    // Project settings
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: 'dist'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      shaders: {
        files: ['<%= yeoman.app%>/shaders/*.*'],
        tasks: ['ngtemplates:shaders'],
        options: {
          livereload: false
        }
      },

      //usemin a8asd9asd8.haha.png makes template in app/ folder breaks
      //use dist items.
      templates: {
        files: ['<%= yeoman.dist%>/views/*.*'],
        tasks: ['ngtemplates:templates'],
        options: {
          livereload: false
        }
      },

      // vanillaCss:{
      //   files: ['<%= yeoman.app%>/styles/*.css'],
      //   options: {
      //     livereload: true
      //   }
      // },

      bower: {
        files: ['bower.json'],
        tasks: ['bowerInstall']
      },
      js: {
        files: [
          '<%= yeoman.app %>/scripts/{,*/}*.js',
          '!<%= yeoman.app %>/scripts/ngTemplates/{,*/}*.js',
          '!<%= yeoman.app %>/scripts/polyfill/{,*/}*.js'
        ],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    // open : {
    //   dev: 'http://APWGL.192.168.0.120.xip.io:9000'
    // },
    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        //localhost
        hostname: '192.168.0.120',
        livereload: 35729
      },
      livereload: {
        options: {
          open: '192.168.0.120:9000',
          base: [
            '.tmp',
            '<%= yeoman.app %>'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]
        }
      },
      testDist: {
        options: {
          port: 9008,
          base: [
            '<%= yeoman.dist %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js',
        '!<%= yeoman.app %>/scripts/ngTemplates/{,*/}*.js',
        '!<%= yeoman.app %>/scripts/polyfill/{,*/}*.js',
        '!<%= yeoman.app %>/scripts/scene/{,*/}*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    bowerInstall: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath: '<%= yeoman.app %>/'
      },
      sass: {
        src: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: '<%= yeoman.app %>/bower_components/'
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: '<%= yeoman.app %>/bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= yeoman.dist %>/images/generated'
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: [
        '<%= yeoman.dist %>/{,*/}*.html'
      ],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    cssmin: {
      options: {
        root: '<%= yeoman.app %>'
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        },{
          expand: true,
          cwd: '<%= yeoman.app %>/textures',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/textures'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // ngmin tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection. It doesn't work on
    // things like resolve or inject so those have to be done manually.
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    exec: {
      openDev: 'open http://dev-apwgl.192.168.0.120.xip.io:9000',
      openDistTest: 'open http://dist-apwgl.192.168.0.120.xip.io:9008'
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server'
      ],
      test: [
        'compass'
      ],
      dist: [
        'compass:dist',
        'imagemin',
        'svgmin'
      ]
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css',
    //         '<%= yeoman.app %>/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/ngTemplates/templates.js': [
    //         '<%= yeoman.dist %>/scripts/ngTemplates/templates.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    // concat: {
    //   options: {
    //     separator: ';',
    //   },
    //   postDist: {
    //     src: ['dist/scripts/*.js', 'dist/scripts/*.js'],
    //     dest: 'dist/built.js',
    //   },
    // },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }
  });


  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      //'bowerInstall',
      'concurrent:server',
      'autoprefixer',
      'connect:testDist',
      'connect:livereload',
      'exec:openDistTest',
      'exec:openDev',
      'watch'
    ]);
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma:unit'
  ]);

  grunt.registerTask('testKeep', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma:keep'
  ]);


  grunt.registerTask('build', [
    'clean:dist',
    //'bowerInstall',
    'ngtemplates:shaders',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngmin:dist',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'htmlmin',
  ]);

  grunt.registerTask('buildTemplates', [
    'clean:dist',
    //'bowerInstall',
    'useminPrepare',
    'concurrent:dist',
    // 'autoprefixer',
    'concat',
    // 'ngmin:dist',
    'copy:dist',
    'cdnify',
    // 'cssmin',
    // 'uglify',
    'rev',
    'usemin',
    'htmlmin',
  ]);

  grunt.registerTask('gruntdefault', [
    'newer:jshint',
    'test',
    'build'
  ]);

  grunt.registerTask('deploy', [
    'newer:jshint',
    'test',
    'buildTemplates', //build twice makes sure it has the right template.
    'build',
    'gh-pages'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'serve'
  ]);
};
