module.exports = function(config) {
    config.set({
        browsers: ['ChromeHeadless'],
        frameworks: ['parallel', 'jasmine'],
        files: [
            'src/**/businessLogic.js',
            'test/**/*.spec.js'
        ]
    });
};