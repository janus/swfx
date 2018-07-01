const gulp = require('gulp');

const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
//const gls = require('gulp-live-server');
//const babelify = require('babelify');
const babel = require('gulp-babel');
const del = require('del');
const runSequence = require('run-sequence');
const server = require( 'gulp-develop-server' );
const browserify = require('browserify');
const mergeStream = require('merge-stream');
//const fs = require('fs');
const source = require('vinyl-source-stream');
const watchify = require('watchify');
const babelify = require('babelify');

const args = process.argv.slice(3);

gulp.task('clean', (done) => del(['docs'], done));

gulp.task('copy', () => {
  return mergeStream(
    gulp.src('public/imgs/**/*').pipe(gulp.dest('docs/public/imgs/')),
    gulp.src('public/**/*.json').pipe(gulp.dest('docs/public')),
    gulp.src('server/**/*.json').pipe(gulp.dest('docs/server')),
    gulp.src('public/html/**/*.html').pipe(gulp.dest('docs'))
  );
});

gulp.task('css', () => {
    return gulp.src('public/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('docs/css'))
});



const bundleBuild = ([originUrl, newUrl, newLocation] ) => {
    return browserify(originUrl)
      //.pipe(watchify())
        .transform(babelify.configure({presets: ['es2016', 'es2015']}))
        .bundle()
      
        .pipe(source(newUrl))
        .pipe(gulp.dest(newLocation));
    
}
gulp.task('js:browser', () => {
   
    [['public/js/main/index.js','main.js','docs/public/js' ],
        ['public/js/sw/sw.js','sw.js','docs']
    ].forEach(item => bundleBuild(item)); 

});


gulp.task('watch', () =>{
    gulp.watch('public/scss/**/*.scss', ['css']);

});

gulp.task('js:server', () => {
  return gulp.src('server/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({presets:['env']}))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('docs/server'));
});
 
// run server
gulp.task( 'server', () => {
    server.listen( { path: './index.js' , cwd:'./docs/server/', args: args } );
    gulp.watch(['server/**/*.js'], server.restart );
});

gulp.task('serve', (callback) => {
  runSequence('clean', ['css', 'js:server',  'js:browser', 'copy'], ['server', 'watch'], callback);
});

