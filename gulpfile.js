const
  // modules
  gulp = require('gulp'),

  // development mode (additional tools)
  devBuild = (process.env.NODE_ENV !== 'production'),

  // variables
  src = 'src/',
  build = 'build/'
  app = '.';

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
  cssnano = require('cssnano'),
  server = require('gulp-webserver');
;

// image
function images() {

	const out = build + 'assets/';
  
	return gulp.src(src + 'assets/**/*')
	  .pipe(newer(out))
	  .pipe(imagemin({ optimizationLevel: 5 }))
	  .pipe(gulp.dest(out));
  
};

// HTML processing
function html() {
	const out = build + 'html/';
  
	return gulp.src(src + 'html/**/*')
	  .pipe(newer(out))
	  .pipe(devBuild ? noop() : htmlclean())
	  .pipe(gulp.dest(out));
};

// compile JS
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

// compile css
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

// serve local html files with http-server
function serve() {
	gulp.src(app)
    .pipe(server({
      livereload: true,
      open: true,
      fallback: 'index.html'
    }));
};

// watch for file changes
function watch(done) {

	// image changes
	gulp.watch(src + 'assets/**/*', images);
  
	// html changes
	gulp.watch(src + 'html/**/*', html);
  
	// css changes
	gulp.watch(src + 'styles/**/*', css);
  
	// js changes
	gulp.watch(src + 'scripts/**/*', js);
  
	done();
};

// tasks
exports.images = images;
exports.html = gulp.series(images, html);
exports.css = gulp.series(images, css);
exports.js = js;
exports.watch = watch;
exports.serve = serve;

exports.build = gulp.parallel(exports.html, exports.css, exports.js);
exports.default = gulp.series(exports.build, exports.watch, exports.serve);