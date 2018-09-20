/*eslint-env node*/

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const browserSync = require('browser-sync').create();

/*

  -- TOP LEVEL FUNCTIONS --

gulp.task - Defines tasks.
gulp.src - Points to files to use.
gulp.dest - Points to folder to output to.
gulp.watch - Watch files and folders for changes.

*/

//Log message
gulp.task('message', () =>
     console.log('Gulp is running...')
);

//Copy ALL HTML files

gulp.task('copyHtml', () =>
     gulp.src('src/*.html')
          .pipe(gulp.dest('dist'))
);

//Optimize images
gulp.task('imageMin', () =>
     gulp.src('src/images/*')
         .pipe(imageMin({
            progressive: true,
            use: [pngquant()]
         }))
         .pipe(gulp.dest('dist/images'))
);

//Compile Sass
gulp.task('sass', () =>
     gulp.src('src/sass/*.scss')
          .pipe(sass({
            outputStyle: 'compressed'
          }).on('error', sass.logError))
          .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
          }))
          .pipe(gulp.dest('dist/css'))
);

//Scripts
gulp.task('scripts', () =>
     gulp.src('src/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js'))
);

//Scripts for distribution
gulp.task('scripts-dist', () =>
     gulp.src('src/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js'))
);

//Run Linter
gulp.task('lint', function () {
    return gulp.src(['js/*.js'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});

//Ready for distribution
gulp.task('dist', [
  'copyHtml',
  'imageMin',
  'sass',
  'lint',
  'scripts-dist'
  ]);

//Default task
gulp.task('default', ['copyHtml', 'imageMin', 'sass', 'scripts', 'lint'], function() {
    browserSync.init({
        server: "./dist"
    });
    gulp.watch('src/*.html', ['copyHtml']).on('change', browserSync.reload);
    gulp.watch('src/sass/*.scss', ['sass']).on('change', browserSync.reload);
    gulp.watch('src/js/*.js', ['scripts']).on('change', browserSync.reload);
});