module.exports = {
    entry: ['./parser.js'],
    externals: {
      url: 'window',
    },
    output: {
        path: './client',
        filename: 'page-metadata-parser.bundle.js',
        libraryTarget: 'var',
        library: 'metadataparser'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
              presets: ['es2015']
            }
        }]
    }
};

