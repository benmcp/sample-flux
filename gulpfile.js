'use strict';

var gulp = require('gulp');
var browserify  = require("browserify");
var vbuffer     = require("vinyl-buffer");
var vsource     = require("vinyl-source-stream");
var reactify = require('reactify');
var rimraf      = require("rimraf");
var pngquant    = require('imagemin-pngquant');
var $ = require("gulp-load-plugins")();


var dist = "dist";
/** Clean */
gulp.task("clean", function() {
    rimraf.sync(".tmp");
    rimraf.sync(dist);
});

gulp.task('javascript', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './src/js/app.js',
    debug: true,
    // defining transforms here will avoid crashing your stream
    transform: [reactify]
  });

  return b.bundle()
    .pipe(vsource('bundle.js'))
    .pipe(vbuffer())
    .pipe($.sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe($.uglify())
        .on('error', $.util.log)
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js/'));
});

/** Livereload */
gulp.task( "watch", ["images", "javascript", "copy"], function() {
    $.livereload.listen();

    /** Watch for PHP changes */
    gulp.watch("src/{**/*.html,css/*.css}", ["copy"]);

    /** Watch for JS changes */
    gulp.watch("src/js/*.js", ["javascript"]);

    /** Watch for Image changes */
    gulp.watch("src/img/**/*.{jpg,png,svg,webp}", ["images"]);

    gulp.watch([
        dist + "**/*.php",
        dist + "/**/*.js",
        dist + "/**/*.css",
        dist + "/**/*.{jpg,png,svg,webp}"
    ]).on( "change", function( file ) {
        $.livereload.changed(file.path);
    });
});

gulp.task("images", function() {
    return gulp.src('src/img/**/*.{jpg,png,gif,svg}')
        .pipe($.cache(
            $.imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: true}],
                use: [pngquant()]
            })
        ))
        .pipe(gulp.dest(dist + '/img'));
});

/** Copy */
gulp.task( "copy",  function() {
    return gulp.src([
        "src/**/*.php",
        "src/**/*.html",
        "src/**/*.css"
    ], {
        base: "src"
    })
    .pipe( gulp.dest( dist ) );
});

/** Build */
gulp.task( "build", [
        "clean",
        "images",
        "copy", 
        "javascript"
    ], function() {} 
);