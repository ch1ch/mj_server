var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat')
  , minifycss = require('gulp-clean-css')
  , bsmain = require('browser-sync').create('bsmain')
  , clean = require('gulp-clean')
  , plumber = require('gulp-plumber')
  , nodemon = require('gulp-nodemon')
  , bsapi = require('browser-sync').create('bsapi')
  , DEV_PORT = 3010
  , MAIN_PORT = 3010
  , API_PORT = 3010;

gulp.task('js', function () {
  return gulp.src('js/**/*.js')
    .pipe(plumber())
    .pipe(jshint())
    .pipe(uglify())
    .pipe(gulp.dest('/js'))
    .pipe(bsmain.stream());
});

/*报错处理*/
function handleError(err) {
  gutil.beep();
  gutil.log(err);
};

gulp.task('js-watch', ['js'], function() {
  bsmain.reload();
});
/*文件改动监听*/
gulp.task('watch',  function() {
  gulp.watch('routers/*.js',['js-watch']);
  gulp.watch('dao/*.js',['js-watch']);
  gulp.watch('js/*.js', ['js-watch']);
  gulp.watch('/app.js', ['js-watch']);
});

/*清空*/
gulp.task('clean', function() {
  return gulp.src([fpath.dest], {read: false})
    .pipe(plumber())
    .pipe(clean());
});


gulp.task('nodemon', function(cb) {
  var called = false;
  return nodemon({
      // nodemon our expressjs server
      script: 'app.js',
      // watch core se1rver file( s) that require server restart on change
      watch: ['conf/', 'app.js', 'routers/*', 'dao/*','js/*','views/*'],
      ext: 'js ejs',
      // exec: 'node-debug',
      env: {
        'PORT':DEV_PORT,
        'MAINPORT': MAIN_PORT,
        'APIPORT': API_PORT
      }
    })
    .on('start', function onStart() {
      // ensure start only got called once
      if (!called) {
        cb();
      }
      called = true;
    })
    .on('restart', function onRestart() {
      // reload connected browsers after a slight delay
      setTimeout(function reload() {
        bsmain.reload({
          stream: false
        });
      }, 500);
    });
});

/**
 * browser-sync配置
 */
function initBrowsersyncMain() {
  bsmain.init({
    port: MAIN_PORT,
    proxy: 'localhost:' + DEV_PORT,
    browser: ['google-chrome']
  });
}

function initBrowsersyncApi() {
  var API_SERVER = require('./conf/config').server;
  bsapi.init({
    ui: false,
    port: API_PORT,
    proxy: {
      target: API_SERVER,
      proxyRes: [
        function(res) {
          res.headers["Access-Control-Allow-Origin"] = '*';
        }
      ]
    },
    browser: ['google-chrome']
  }, initBrowsersyncMain);
}



gulp.task('browser-sync',['nodemon'], initBrowsersyncApi);

/*启动*/
gulp.task('default', function() {
  gulp.start('watch');
  gulp.start('nodemon');
});
