// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular', 'karma-typescript'],
        plugins: [
            require('karma-jasmine'),
            require('karma-typescript'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage-istanbul-reporter'),
            require('@angular-devkit/build-angular/plugins/karma'),
            require('karma-firefox-launcher'),
            require('karma-verbose-reporter')
        ],
        client: {
            jasmine: {
                random: false
            },
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        coverageIstanbulReporter: {
            dir: require('path').join(__dirname, 'coverage'),
            reports: ['html', 'lcovonly', 'text-summary'],
            fixWebpackSourcePaths: true,
            thresholds: {
                statements: 80,
                lines: 80,
                branches: 50,
                functions: 75,
            }
        },
        preprocessors: {
            "**/*.ts": ["karma-typescript"]
        },
        karmaTypescriptConfig: {
            exclude: [
                "node_modules"
            ],
            reports: {
                "lcovonly": {
                    "directory": "coverage",
                    "filename": "lcov.info",
                    "subdirectory": "lcov"
                }
            }
        },
        reporters: ['kjhtml', 'karma-typescript', 'verbose'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['ChromeHeadlessNoSandbox'],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        },
        singleRun: true,
        captureTimeout: 21000000,
        browserDisconnectTolerance: 3,
        browserDisconnectTimeout: 21000000,
        browserNoActivityTimeout: 21000000
    });
};