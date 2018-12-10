const gulp = require('gulp');
const Server = require('karma').Server;
const eslint = require('gulp-eslint');
/*
    karma tasks
*/
gulp.task('test', function(done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('tdd', function(done) {
    new Server({
        configFile: __dirname + '/karma.conf.js'
    }, done).start();
});

/*
    ESLint task
*/
gulp.task('lint', function() {
    return gulp.src('src/**').pipe(eslint({
            'rules': {
                'quotes': [1, 'single'],
                'semi': [1, 'always']
            }
        }))
        .pipe(eslint.format())
        // Brick on failure to be super strict
        .pipe(eslint.failOnError());
});

gulp.task('default', gulp.series('lint', 'test'));