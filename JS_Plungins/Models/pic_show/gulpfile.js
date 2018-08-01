// npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-uglify gulp-rename gulp-concat gulp-umd --save-dev

var gulp 			= require( 'gulp' ),
	sass 			= require( 'gulp-ruby-sass' ),
	autoprefixer 	= require( 'gulp-autoprefixer' ),
	minifycss 		= require( 'gulp-minify-css' ),
	uglify 			= require( 'gulp-uglify' ),
	rename 			= require( 'gulp-rename' ),
	concat 			= require( 'gulp-concat' ),
	umd				= require( 'gulp-umd' );


var outputDir 		= 'dist';



//	Default task 'gulp': Runs both CSS and JS tasks
gulp.task( 'default', function() {
    gulp.start( 'css', 'js' );
});



//	Watch task 'gulp watch': Starts a watch on CSS and JS tasks
gulp.task( 'watch', function() {
	gulp.watch( 'src/**/*.scss'	, [ 'css' ] );
	gulp.watch( 'src/**/*.js'	, [ 'js' ] );
});



//	CSS task 'gulp css': Compiles all CSS
gulp.task( 'css', [ 'css-concat' ] );

//	1) compile all SCSS to CSS
gulp.task( 'css-compile', function() {
	return sass( 'src/**/*.scss', { style: 'expanded' })
		.pipe( autoprefixer( [ '> 5%', 'last 5 versions' ] ) )
		.pipe( minifycss({ keepBreaks: true }) )
		.pipe( gulp.dest( outputDir ) );
});

//	2) concatenate all in dist dir
gulp.task( 'css-concat', [ 'css-compile' ], function() {
	return gulp.src([
			outputDir + '/css/jquery.tosrus.css',
			outputDir + '/css/addons/*.css',
			outputDir + '/css/media/*.css'
		])
		.pipe( concat( 'jquery.tosrus.all.css' ) )
		.pipe( gulp.dest( outputDir + '/css' ) );
});



//	JS task 'gulp js': Runs all JS tasks
gulp.task( 'js', [ 'js-umd' ] );

//	1) copy all into dist dir
gulp.task( 'js-copy', function() {
	return gulp.src( 'src/**/*.js' )
		.pipe( rename({ suffix: '.min' }) )
		.pipe( gulp.dest( outputDir ) );
});

//	2) concatenate all in dist dir
gulp.task( 'js-concat', [ 'js-copy' ], function() {
	return gulp.src([
			outputDir + '/js/jquery.tosrus.min.js',
			outputDir + '/js/addons/*.js',
			outputDir + '/js/media/*.js'
		])
		.pipe( concat( 'jquery.tosrus.all.min.js' ) )
		.pipe( gulp.dest( outputDir + '/js' ) );
});

//	3) minify all in dist dir
gulp.task( 'js-minify', [ 'js-concat' ], function() {
	return gulp.src( outputDir + '/**/*.min.js' )
		.pipe( uglify({ preserveComments: 'license' }) )
		.pipe( gulp.dest( outputDir ) );
});

//	4) umd core in dist dir
gulp.task( 'js-umd', [ 'js-minify' ], function() {
	return gulp.src([
			outputDir + '/js/jquery.tosrus.min.js',
			outputDir + '/js/jquery.tosrus.all.min.js',
		])
		.pipe( umd({
			dependencies: function() { return [ 'jQuery' ]; },
			exports: function() { return true; },
			namespace: sanitizeNamespaceForUmd
		}))
		.pipe( rename({ suffix: '.umd' }) )
		.pipe( gulp.dest( outputDir + '/js' ) );
});
function sanitizeNamespaceForUmd( file ) {
	path = file.path.split( '\\' ).join( '/' ).split( '/' );
	path = path[ path.length - 1 ];
	return path.split( '.' ).join( '_' );
}

