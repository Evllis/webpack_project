// build/webpack.base.config.js
const path = require('path')

module.exports = {
    // 入口
    entry: {
        main: './src/index.js'
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/' // 打包后的资源的访问路径前缀
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
    }
}
