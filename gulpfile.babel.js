const gulp = require('gulp');
const Server = require('karma').Server;
const eslint = require('gulp-eslint');
const eslintConfig = {
    "env": {
        "browser": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 6
    },
    // See https://eslint.org/docs/rules/ for rules
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": 0, // allow console.log etc
        "no-extra-boolean-cast": 0, // allow using !! to cast to boolean
        "no-unused-vars":
            ["error",
            {
                "vars": "all", // no unused variables in any scope
                // allow trailing unused args since functions may be called with
                // them even if they aren't used in the function
                "args": "none"
            }
        ],
        "no-trailing-spaces": ["error"],
        "curly": ["error"],
        "no-extend-native": ["error"],
        "prefer-const": ["error"]
    }
};

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
    return gulp.src('src/**').pipe(eslint(eslintConfig))
        .pipe(eslint.format())
        // Brick on failure to be super strict
        .pipe(eslint.failOnError());
});

gulp.task('default', gulp.series('lint', 'test'));