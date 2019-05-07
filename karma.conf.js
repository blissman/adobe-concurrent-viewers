module.exports = function(config) {
    config.set({
        browsers: ['ChromeHeadless'],
        frameworks: ['parallel', 'jasmine'],
        files: [
            'dist/**/businessLogic.js',
            'test/**/*.spec.js'
        ]
    });
};