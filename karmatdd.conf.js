module.exports = function(config) {
    config.set({
        browsers: ['ChromeHeadless'],
        frameworks: ['parallel', 'jasmine'],
        files: [
            'src/**/parseToCSV.js',
            'test/**/*.spec.js'
        ]
    });
};