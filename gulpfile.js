var gulp = require('gulp');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');
var rimraf = require('gulp-rimraf');
var minifyHtml = require('gulp-minify-html');
//var imagemin = require('gulp-imagemin');
//var pngquant = require('imagemin-pngquant');


gulp.task('cleanBuild', function () {
    return gulp.src('build/*', { read: false }) // much faster
      .pipe(rimraf());
});

gulp.task('copyImages', ['cleanBuild'], function () {
    return gulp.src('./img/*')
        //.pipe(imagemin({
        //    progressive: true,
        //    svgoPlugins: [{ removeViewBox: false }],
        //    use: [pngquant()]
        //}))
        .pipe(gulp.dest('build/img'))
});


gulp.task('copyFonts', ['cleanBuild'], function () {
    var fontsSrc = ['bower_components/font-awsome/fonts/*', 'bower_components/bootstrap/dist/fonts/*'];
    
    return gulp.src(fontsSrc)
    .pipe(gulp.dest('build/fonts'))
})

gulp.task('usemin', ['copyFonts', 'copyImages'], function () {
    return gulp.src('./*.html')
      .pipe(usemin({
          css: [minifyCss(), 'concat'],
          html: [minifyHtml({ empty: true })],
          js: [uglify(), rev()]
      }))
      .pipe(gulp.dest('build/'));
});