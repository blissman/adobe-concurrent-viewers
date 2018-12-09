const gulp = require('gulp');
const Server = require('karma').Server;

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

function defaultTask(cb) {
    // place code for your default task here
    cb();
}

exports.default = defaultTask