module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('build', ['sass','cssmin','es6transpiler','uglify','copy:build','compress','replace','clean']);
  grunt.registerTask('serve:build', ['build','connect','open','watch']);
  grunt.registerTask('serve', ['sass','cssmin','es6transpiler','copy:dev','connect','open','watch']);
  grunt.registerTask('publish', ['build','shell:git_add','shell:git_commit','shell:npm_version','shell:git_push','shell:npm_publish','shell:surge']);

  grunt.initConfig ({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      demo: {
        files: {
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
          dest: 'demo',
          ext: '.min.css'
        }]
      }
    },
    es6transpiler: {
      main: {
          files: {
              'js/script_transpiled.js': 'js/script.js',
              'js/demo_transpiled.js': 'js/demo.js'
          }
      }
    },
    uglify: {
      options: {
        banner: '/* ' +
          '<%= pkg.name %> v<%= pkg.version %> ' +
          '(<%= grunt.template.today("yyyy-mm-dd") %>) | ' +
          '<%= pkg.homepage %> | ' +
          '(c) <%= grunt.template.today("yyyy") %> <%= pkg.author %> | ' +
          'licensed <%= pkg.license %> ' +
          '*/\n'
      },
      main: {
        files: {
          'demo/bubb.min.js': ['js/script_transpiled.js']
        }
      }
    },
    copy: {
      build: {
        files: [{
          src: 'demo/bubb.min.js',
          dest: 'dist/bubb.min.js'
        },
        {
          src: 'demo/bubb.min.css',
          dest: 'dist/bubb.min.css'
        },
        {
          src: 'js/demo_transpiled.js',
          dest: 'demo/demo.min.js'
        }]
      },
      dev: {
        files: [{
          src: 'js/script_transpiled.js',
          dest: 'demo/bubb.min.js'
        },
        {
          src: 'js/demo_transpiled.js',
          dest: 'demo/demo.min.js'
        },
        {
          src: 'scss/demo.css',
          dest: 'demo/demo.min.css'
        },
        {
          src: 'scss/bubb.css',
          dest: 'demo/bubb.min.css'
        },
        {
          src: 'html/index.html',
          dest: 'demo/index.html'
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
          {expand: true, flatten: true, src: ['html/index.html'], dest: 'demo/'}
        ]
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
          base: 'demo'
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
    }
  });

};
