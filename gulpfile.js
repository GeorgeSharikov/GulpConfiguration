const {src, dest, parallel, series, watch} = require('gulp')
const browserSync = require('browser-sync').create()
const ugify = require('gulp-uglify-es').default
const concat = require('gulp-concat')
const sass = require('gulp-dart-sass')
const autoprefixer = require('gulp-autoprefixer')
const cleancss = require('gulp-clean-css')
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const del = require('del');
const fileInclude = require('gulp-file-include')

function browserSyncFn(){
	browserSync.init({
		server: {baseDir: 'dist/'},
		notify: false,
		online: true
	})
}

function html(){
	return src(['app/**/*.html', '!app/**/_*.html'])
	.pipe(fileInclude())
	.pipe(dest('./dist'))
	.pipe(browserSync.stream())
}

function scripts(){
	return src('app/js/app.js')
	.pipe(dest('dist/js'))
	.pipe(concat('app.min.js'))
	.pipe(ugify())
	.pipe(dest('dist/js'))
	.pipe(browserSync.stream())
}

function styles(){
	return src([`app/sass/main.sass`])
	.pipe(sass())
	.pipe(dest('dist/sass/'))
	.pipe(concat('app.min.css'))
	.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
	.pipe(cleancss({ level: { 1: { specialComments: 0 } }}))
	.pipe(dest('dist/css/'))
	.pipe(browserSync.stream())
}


function fonts(){
	return src('./app/fonts/**/*.{eot,svg,ttf,woff,woff2}') 
	.pipe(dest('./dist/fonts/'))
}

function images(){
	return src('app/img/**/*')
	.pipe(newer('app/img/'))
	.pipe(imagemin())
	.pipe(dest('dist/img/'))
}

function startWatch(){
	watch(['app/js/**/*.js', '!app/js/**/*.min.js'], scripts)
	watch('app/sass/**/*.sass', styles)
	watch('app/**/*.html', html)
	watch('app/img/**/*', images)
}

function cleanImg(){
	return del('app/img/dest/**/*', {force: true})
}

function cleanDist(){
	return del('dist/**/*', {force: true})
}

function build(){
	return src([
		'app/css/**/*.css',
		'app/js/**/*.js',
		'app/img/**/*'
	], {base: 'app'})
	.pipe(dest('dist/'))
}

exports.build = series(cleanDist, images, styles, fonts, scripts, html, build)
exports.fonts = fonts
exports.cleanDist = cleanDist
exports.cleanImg = cleanImg
exports.images = images
exports.styles = styles
exports.html = html
exports.browserSyncFn = browserSyncFn
exports.scripts = scripts
exports.default = parallel( html, scripts, styles, fonts, browserSyncFn, startWatch)
