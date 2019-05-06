module.exports = function(config) {
    config.set({
        browsers: ['ChromeHeadless'],
        frameworks: ['parallel', 'jasmine'],
        files: [
            'dist/**/parseToCSV.js',
            'test/**/*.spec.js'
        ]
    });
};