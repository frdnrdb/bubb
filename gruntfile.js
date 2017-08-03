module.exports = function(grunt) {

  require('dotenv').config();
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('build', ['sass','cssmin','es6transpiler:dist','uglify','compress','replace','clean']); //'header','clean'
  grunt.registerTask('serve:build', ['build','connect','open','watch']);
  grunt.registerTask('serve', ['sass','cssmin','es6transpiler','copy','connect','open','watch']);
  grunt.registerTask('publish', ['build','shell:git_add','shell:git_commit','shell:git_push','shell:npm_version','shell:npm_publish','shell:surge']);

  grunt.registerTask('dev', ['test']);

  grunt.initConfig ({
    sass: {
      dist: {
        files: {
          //'scss/style.css' : 'scss/style.scss',
          'scss/demo.css' : 'scss/demo.scss',
          'scss/bubb.css' : 'scss/bubb.scss'
        }
      }
    },
    cssmin: {
      css: {
        files: [{
          expand: true,
          cwd: 'scss/',
          src: ['*.css'],
          dest: 'dist',
          ext: '.min.css'
        }]
      }
    },
    es6transpiler: {
      dist: {
          files: {
              'js/script_transpiled.js': 'js/script.js',
              'js/demo_transpiled.js': 'js/demo.js'
          }
      }
    },
    uglify: {
      js: {
        files: {
          'dist/bubb.min.js': ['js/script_transpiled.js'],
          'dist/demo.min.js': ['js/demo_transpiled.js']
        }
      }
    },
    copy: {
      main: {
        files: [{
          src: 'js/script_transpiled.js',
          dest: 'dist/bubb.min.js'
        },
        {
          src: 'js/demo_transpiled.js',
          dest: 'dist/demo.min.js'
        },
        {
          src: 'scss/demo.css',
          dest: 'dist/demo.min.css'
        },
        {
          src: 'scss/bubb.css',
          dest: 'dist/bubb.min.css'
        },
        {
          src: 'html/index.html',
          dest: 'dist/index.html'
        }]
      }
    },
    replace: {
      default: {
        options: {
          patterns: [
            {
              match: /<.+\sdelete\s.*\/.+>/g,
              replacement: ''
            },
            {
              match: /{{filesize-(.+)}}/g,
              replacement: function (match, key) {
                var fs = require('fs');
                function getFilesizeInBytes(filename) {
                    const stats = fs.statSync(filename)
                    const fileSizeInBytes = stats.size
                    return (fileSizeInBytes/1024).toFixed(1)+' kB'
                }
                return getFilesizeInBytes('./dist/bubb.min.'+key);
              }
            },
          ]
        },
        files: [
          {expand: true, flatten: true, src: ['html/index.html'], dest: 'dist'}
        ]
      }
    },
    header: {
        dist: {
            options: {
                text: '/* by frdnrdb '+new Date().toISOString()+' */'
            },
            files: {
                'dist/demo.min.css': 'dist/demo.min.css',
                'dist/bubb.min.css': 'dist/bubb.min.css',
                'dist/bubb.min.js': 'dist/bubb.min.js'
            }
        }
    },
    clean: ['scss/style.css', 'scss/demo.css', 'scss/bubb.css', 'js/script_transpiled.js', 'js/demo_transpiled.js'],
    watch: {
      source: {
        files: ['scss/*.scss','html/index.html','js/script.js','js/demo.js'],
        tasks: ['sass','es6transpiler','copy','clean'],
        options: {
          livereload: true
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 5000,
          hostname: 'localhost',
          base: 'dist'
        }
      }
    },
    open : {
      main: {
        path: 'http://localhost:5000',
        app: grunt.option('safari') ? 'Safari' : 'Google Chrome'
      }
    },
    shell: {
  		git_add: {
  			command: 'git add .'
  		},
      git_commit: {
  			command: 'git commit -m \'patch\''
  		},
      git_push: {
  			command: 'git push origin master'
  		},
      npm_version: {
  			command: 'npm version patch'
  		},
      npm_publish: {
  			command: 'npm publish'
  		},
      surge: {
  			command: 'surge'
  		}
  	},
    compress: {
      main: {
        options: {
          mode: 'gzip'
        },
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['bubb.min.css'],
          dest: 'dist/',
          extDot: 'last',
          ext: '.gzip.css'
        },
        {
          expand: true,
          cwd: 'dist/',
          src: ['bubb.min.js'],
          dest: 'dist/',
          extDot: 'last',
          ext: '.gzip.js'
        }]
      }
    },
    test: {
      build: {
        src: './dist/bubb.min.js',
        dest: './dist/test.min.js'
      }
    }
  });

  grunt.registerMultiTask('test', 'test task', function() {

    //make grunt know this task is async.
    var done = this.async();

    // https://stackoverflow.com/questions/18824071/create-a-custom-grunt-task-for-processing-files
    grunt.log.writeln('test...', this);

    done(true);


  });

};
