const
  // modules
  gulp = require('gulp'),

  // development mode?
  devBuild = (process.env.NODE_ENV !== 'production'),

  // olders
  src = 'src/',
  build = 'build/'

  //packages
  newer = require('gulp-newer'),
  imagemin = require('gulp-imagemin'),

  noop = require('gulp-noop'),
  htmlclean = require('gulp-htmlclean'),

  concat = require('gulp-concat'),
  deporder = require('gulp-deporder'),
  terser = require('gulp-terser'),
  stripdebug = devBuild ? null : require('gulp-strip-debug'),
  sourcemaps = devBuild ? require('gulp-sourcemaps') : null,

  sass = require('gulp-sass'),
  postcss = require('gulp-postcss'),
  assets = require('postcss-assets'),
  autoprefixer = require('autoprefixer'),
  mqpacker = require('css-mqpacker'),
  cssnano = require('cssnano')
;

// image
function images() {

	const out = build + 'assets/';
  
	return gulp.src(src + 'assets/**/*')
	  .pipe(newer(out))
	  .pipe(imagemin({ optimizationLevel: 5 }))
	  .pipe(gulp.dest(out));
  
};
exports.images = images;

// HTML processing
function html() {
	const out = build + 'html/';
  
	return gulp.src(src + 'html/**/*')
	  .pipe(newer(out))
	  .pipe(devBuild ? noop() : htmlclean())
	  .pipe(gulp.dest(out));
};
exports.html = gulp.series(images, html);

// JavaScript processing
function js() {

	return gulp.src(src + 'scripts/**/*')
	  .pipe(sourcemaps ? sourcemaps.init() : noop())
	  .pipe(deporder())
	  .pipe(concat('main.js'))
	  .pipe(stripdebug ? stripdebug() : noop())
	  .pipe(terser())
	  .pipe(sourcemaps ? sourcemaps.write() : noop())
	  .pipe(gulp.dest(build + 'scripts/'));
};
exports.js = js;

// CSS
function css() {

	return gulp.src(src + 'styles/main.scss')
	  .pipe(sourcemaps ? sourcemaps.init() : noop())
	  .pipe(sass({
		outputStyle: 'nested',
		imagePath: '/images/',
		precision: 3,
		errLogToConsole: true
	  }).on('error', sass.logError))
	  .pipe(postcss([
		assets({ loadPaths: ['images/'] }),
		autoprefixer({ browsers: ['last 2 versions', '> 2%'] }),
		mqpacker,
		cssnano
	  ]))
	  .pipe(sourcemaps ? sourcemaps.write() : noop())
	  .pipe(gulp.dest(build + 'css/'));
  
  };
exports.css = gulp.series(images, css);

exports.build = gulp.parallel(exports.html, exports.css, exports.js);

// watch for file changes
function watch(done) {

	// image changes
	gulp.watch(src + 'images/**/*', images);
  
	// html changes
	gulp.watch(src + 'html/**/*', html);
  
	// css changes
	gulp.watch(src + 'scss/**/*', css);
  
	// js changes
	gulp.watch(src + 'js/**/*', js);
  
	done();
  
};
exports.watch = watch;

// default
exports.default = gulp.series(exports.build, exports.watch);