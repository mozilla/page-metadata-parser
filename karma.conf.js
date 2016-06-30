const path = require('path');

module.exports = function(config) {
  config.set({
    singleRun: true,
    browsers: ['Firefox'],
    frameworks: ['mocha'],
    reporters: ['mocha', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        {type: 'lcov', subdir: 'lcov'},
        {type: 'text-summary', subdir: '.', file: 'text-summary.txt'}
      ]
    },
    files: [
      'tests/index.js'
    ],
    preprocessors: {
      'tests/**/*.js': ['webpack', 'sourcemap']
    },
    webpack: {
      module: {
        loaders: [{test: /\.json$/, loader: 'json'}],
        postLoaders: [{
          test: /\.js$/,
          loader: 'istanbul-instrumenter',
          include: [path.join(__dirname, 'parser.js')]
        }]
      },
      externals: {
        'jsdom': 'jsdom',
      },
      devtool: 'inline-source-map'
    },
    webpackMiddleware: {
      noInfo: true
    }
  });
};
