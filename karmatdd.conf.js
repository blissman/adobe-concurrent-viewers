module.exports = function(config) {
    config.set({
        browsers: ['ChromeHeadless'],
        frameworks: ['parallel', 'jasmine'],
        files: [
            'src/**/*.js',
            'test/**/*.spec.js'
        ]
    });
};