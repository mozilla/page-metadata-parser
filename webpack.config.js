module.exports = {
    entry: ['babel-polyfill', './parser.js'],
    output: {
        path: './bin',
        filename: 'page-metadata-parser.bundle.js',
        libraryTarget: "var",
        library: "metadataparser"
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

