const path = require('path');
const CopyFilePlugin = require("copy-webpack-plugin");
//const WriteFilePlugin = require("write-file-webpack-plugin");

module.exports = {
    context: `${__dirname}/src`,
    entry: {
        'likeScratchLib': path.join(__dirname, '/src', 'likeScratchLib.js')
//        'likeScratchLib': path.join(__dirname, '/src', 'index.js')
    },
    output: {
        path: path.join(__dirname, '/build'),
        filename: '[name].js',
        clean: true,
        library:{
            type: "module",
        },
//        library: "likeScratchLib",
//        libraryTarget: "global", // global
//        libraryTarget: "umd", // global
//        iife: true, // --> when "umd", iife is true
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
//                    exports: 'Process',
                }
            }
        ]
    },
    devtool: 'source-map',
    plugins: [
        new CopyFilePlugin({
            patterns: [
                {
                    context: "buildPackageConf",
                    from: "**/*.json",
                    to: path.resolve(__dirname, "build")
                },        

            ],
        }),
        //new WriteFilePlugin()
    ],

}
