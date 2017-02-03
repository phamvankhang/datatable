var folder = 'build'
var webpack = require("webpack");

module.exports = {
    devtool: 'source-map',
    debug: false,
    cache: false,
    entry: {
        "khangpv-datatable": __dirname + '/reapp/datatable/index',
    },
    output: {
        path: __dirname + '/build/' + folder,
        filename: '[name].js'
        // libraryTarget: 'var',
        // library: 'UYLIX'
    },
    module: {
        loaders: [

            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: /(node_modules|bower_components)/,
                query: {
                    cacheDirectory: true,
                    presets: ['react', 'stage-0', 'stage-1', 'stage-2', 'es2015']
                }
            }

        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: { warnings: false }
        })
    ]
};