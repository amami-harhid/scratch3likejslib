const path = require('path');

module.exports = {
    context: `${__dirname}/src`,
    entry: {
        'likeScratchLib': path.join(__dirname, '/src', 'likeScratchLib.js')
    },
    output: {
        path: path.join(__dirname, '/build'),
        filename: '[name].js'
    },
    module:{
        rules:[
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    },
    devtool: 'source-map',
}
