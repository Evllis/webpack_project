// build/webpack.config.js
const path = require('path')

const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    // 指定构建环境
    mode: 'development',
    entry: {
        main: './src/index.js'
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/, // 这个node_modules文件夹里面的js/jsx文件不需要使用babel-loader
                loader: 'babel-loader'
            },
            {
                test:/\.css$/,
                exclude: /node_modules/,
                use:['style-loader', 'css-loader']
            },
            {
                test:/\.less$/,
                exclude: /node_modules/,
                use:['style-loader', 'css-loader', 'less-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: '极限编程网',
            filename: 'index.html',
            inject: "body",
            template: "./src/index.html",
            hash: true,
            meta: {
              'set-cookie': { 'http-equiv': 'set-cookie', content: 'name=value; expires=date; path=url' },
            }
        })
    ]
}
