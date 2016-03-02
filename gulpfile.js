'use strict';
var gulp = require('gulp'),
	$    = require('gulp-load-plugins')(),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	pngquant = require('imagemin-pngquant'),
	del = require('del');

var path = {
	app: {
		html: ['app/**/*.jade', '!app/layout.jade'],
		style: 'app/**/*.sass',
		img: 'app/**/*.{png,jpg,jpeg}'
	},
	watch: { 
		html: 'app/**/*.jade',
		style: 'app/**/*.sass',
		img: 'app/**/*.{png,jpg,jpeg}'
	},
	dist: 'dist'
};

var config = {
	server: {
		baseDir: "dist/320x50/"
	},
	tunnel: false,
	host: 'localhost',
	port: 9000,
	logPrefix: "Frontend Work!"
};

gulp.task('html', function () {
	gulp.src(path.app.html)
	.pipe($.plumber())
	.pipe($.jade({
			pretty: true
		}))
	.pipe(gulp.dest(path.dist)) 
	.pipe(reload({stream: true})); 
});

gulp.task('style', function () {
	gulp.src(path.app.style)
		.pipe($.plumber())
		.pipe($.sass({
			indentedSyntax: true
		}))
		.pipe($.autoprefixer({
			browsers: ['last 10 versions', 'ie >= 9'],
			cascade: true
		}))
		.pipe($.cssnano())
		.pipe(gulp.dest(path.dist))
		.pipe(reload({stream: true}));
});

gulp.task('image', function () {
	gulp.src(path.app.img)
		.pipe($.plumber())
		.pipe($.newer(path.dist))
		.pipe($.imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.dist))
		.pipe(reload({stream: true}));
});

gulp.task('clean', function () {
	return del(path.dist);
});
 
gulp.task('dev', [
	'html',
	'image',
	'style'
]);

gulp.task('watch', function () {
	$.watch(path.watch.html, $.batch(function (events, done) {
		gulp.start('html', done);
	}));
	$.watch(path.watch.style, $.batch(function (events, done) {
		gulp.start('style', done);
	}));
	$.watch(path.watch.img, $.batch(function (events, done) {
		gulp.start('image', done);
	}));
});

gulp.task('webserver', function () {
	browserSync(config);
});

gulp.task('default', ['dev', 'webserver', 'watch']);

