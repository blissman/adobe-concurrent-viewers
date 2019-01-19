module.exports = function(config) {
    config.set({
        browsers: ['Chrome'],
        frameworks: ['parallel', 'jasmine'],
        files: [
            'src/**/*.js',
            'test/**/*.spec.js'
        ]
    });
};