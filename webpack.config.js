const path = require('path');

module.exports = {
    context: `${__dirname}/src`,
    entry: {
        'likeScratchLib': path.join(__dirname, '/src', 'likeScratchLib.js')
    },
    output: {
        path: path.join(__dirname, '/build'),
        filename: 'index.js',
        clean: true,
        library:{
            type: "module",
        },
    },
    experiments: {
        outputModule: true,
    },
    module:{
        rules:[
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\/src\/*\.js$/,
                loader: "exports-loader",
                options: {
                    exports: 'default',
                }
            }
        ]
    },
    devtool: 'source-map',
}
