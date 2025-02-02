const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const base = {
    devServer: {
        contentBase: false,
        host: '0.0.0.0',
        port: process.env.PORT || 8362
    },
    module: {
        rules: [
            {
                include: [
                    path.resolve(__dirname, 'src')
                ],
                loader: 'babel-loader',
                options: {
                    presets: ['es2015']
                }
            },
        ]
    },
    plugins: process.env.NODE_ENV === 'production' ? [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true
        })
    ] : []
};

module.exports = [
    Object.assign({}, base, {
        target: 'web',
        entry: {
            'likeScratch': './src/likeScratch.js'
        },
        output: {
            path: path.resolve(__dirname, 'web/dist'),
            filename: '[name].js'
        },
        devtool: 'source-map',
        plugins: base.plugins.concat([
            new CopyWebpackPlugin([
                {
                    from: 'src'
                }
            ])
        ])
    }),
];