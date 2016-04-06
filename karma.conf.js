module.exports = function (config) {
    config.set({
        basePath: '.',
        frameworks: ['jasmine'],
        files: [
            // paths loaded by Karma
            { pattern: 'node_modules/angular2/bundles/angular2-polyfills.js', included: true, watched: true },
            { pattern: 'node_modules/systemjs/dist/system.src.js', included: true, watched: true },
            { pattern: 'node_modules/rxjs/bundles/Rx.js', included: true, watched: true },
            { pattern: 'node_modules/lodash/lodash.js', included: true, watched: true },
            { pattern: 'node_modules/angular2/bundles/angular2.dev.js', included: true, watched: true },
            { pattern: 'node_modules/angular2/bundles/testing.dev.js', included: true, watched: true },
            { pattern: 'karma-test-shim.js', included: true, watched: true },

            // paths loaded via module imports
            { pattern: 'build/**/*.js', included: false, watched: true },

            // paths to support debugging with source maps in dev tools
            { pattern: 'src/**/*.ts', included: false, watched: false },
            { pattern: 'spec/**/*.ts', included: false, watched: false },
            { pattern: 'build/**/*.js.map', included: false, watched: false },
            { pattern: 'node_modules/angular2/bundles/testing.dev.js.map', included: false, watched: false },
        ],

        // proxied base paths
        proxies: {
            '/src/': '/base/src/'
        },

        port: 9876,
        logLevel: config.LOG_INFO,
        colors: true,
        autoWatch: true,
        browsers: ['Chrome'],

        plugins: [
            'karma-jasmine',
            'karma-coverage',
            'karma-chrome-launcher'
        ],

        // Coverage reporter generates the coverage
        reporters: ['progress', 'dots', 'coverage'],

        // Source files that you wanna generate coverage for.
        // Do not include tests or libraries (these files will be instrumented by Istanbul)
        preprocessors: {
            'build/**/!(*spec).js': ['coverage']
        },

        coverageReporter: {
            reporters: [
                { type: 'json', subdir: '.', file: 'coverage-final.json' }
            ]
        },

        singleRun: true
    })
};