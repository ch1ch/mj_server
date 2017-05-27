var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat')
  , sass = require('gulp-ruby-sass')
  , minifycss = require('gulp-clean-css')
  , autoprefixer = require('gulp-autoprefixer')
  , bsmain = require('browser-sync').create('bsmain')
  , clean = require('gulp-clean')
  , cache = require('gulp-cache')
  , imagemin = require('gulp-imagemin')
  , plumber = require('gulp-plumber')
  , nodemon = require('gulp-nodemon')
  , bsapi = require('browser-sync').create('bsapi')
  , template = require('gulp-template')
  , rename = require('gulp-rename')
  , DEV_PORT = 910
  , MAIN_PORT = 2900
  , API_PORT = 2901;


// 生成版本号
var date_rev = new Date()
  , y, m, d, hh, mm, ss;
y = date_rev.getFullYear();
m = date_rev.getMonth() + 1;
d = date_rev.getDate();
hh = date_rev.getHours();
mm = date_rev.getMinutes();
ss = date_rev.getSeconds();

m = m > 10 ? m : '0' + m;
d = d > 10 ? d : '0' + d;
date_rev = [y, m, d, hh, mm, ss].join('');

/*文件路径配置*/
var fpath = {
  src: 'static',
  dest: 'public'
};

/*报错处理*/
function handleError(err) {
  gutil.beep();
  gutil.log(err);
};

// gulp.task('minify', function() {
//    gulp.src('js/app.js')
//     .pipe(uglify())
//     .pipe(gulp.dest('dist'))
// });

gulp.task('js', function () {
  return gulp.src('js/**/*.js')
    .pipe(plumber())
    .pipe(jshint())
    .pipe(uglify())
    .pipe(gulp.dest(fpath.dest +'/js'))
    .pipe(bsmain.stream());
});

/*编译sass文件*/ 
gulp.task('css', function() {
  return sass(fpath.src + '/scss/*.{sass,scss}', {
    defaultEncoding: "utf-8",
    noCache: true
  })
    .on('error', sass.logError)
    .pipe(minifycss({compatibility: 'ie7'}))
    .pipe(autoprefixer())
    .pipe(gulp.dest(fpath.dest + '/css'))
    .pipe(bsmain.stream())
});


/*压缩图片*/
gulp.task('images', function() {
  return gulp.src(fpath.src + '/images/**/')
    .pipe(plumber())
    .pipe(cache(imagemin({optimizationLevel:3, progressive:true, interlaced:true})))
    .pipe(gulp.dest(fpath.dest + '/images'));
});

gulp.task('js-watch', ['js'], function() {
  bsmain.reload();
});

/*文件改动监听*/
gulp.task('watch',  function() {
  gulp.watch(fpath.src + 'routers/*.js',['js-watch']);
  gulp.watch(fpath.src + 'dao/*.js',['js-watch']);
  gulp.watch(fpath.src + 'js/*.js', ['js-watch']);
  gulp.watch(fpath.src + '/app.js', ['js-watch']);
});

/*清空*/
gulp.task('clean', function() {
  return gulp.src([fpath.dest], {read: false})
    .pipe(plumber())
    .pipe(clean());
});

/* 版本号增加到config.js文件 */
gulp.task('configsrc', function() {
  return gulp.src('/conf/config.js')
    .pipe(template({date_rev: date_rev}))
    .pipe(rename('config.js'))
    .pipe(gulp.dest('conf/config/'));
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


/*任务执行*/
gulp.task('output', ['css', 'images', 'js'], function() {
  gulp.start('configsrc');
});


/*启动*/
gulp.task('default', function() {
  gulp.start('watch');
  gulp.start('nodemon');
  
});