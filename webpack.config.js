var webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    context: __dirname,
    entry: {
        main: "./client/js/main.js",
        ui: "./client/js/ui.js"
    },
    output: {
        path: __dirname + "/client/dist",
        filename: "[name].bundle.js",
        libraryTarget: 'var',
        library: 'ui'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('style.css')
    ]
};