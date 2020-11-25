// build/webpack.base.config.js
const path = require('path')

const devMode = process.env.NODE_ENV === 'development' // 是否开发模式

const setMPA = require('./util')

const { entry, htmlWebpackPlugins } = setMPA()

// css压缩
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    // 入口
    entry,
    output: {
        filename: '[name]/js/index.[hash:8].js',
        chunkFilename: '[name]/js/index.[chunkhash:8].js',
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
                test:/\.css$/i,
                exclude: /node_modules/,
                use:[
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../', // 修改公共路徑
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        }
                    },
                ]
            },
            {
                test:/\.less$/,
                exclude: /node_modules/,
                use:[
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'img/[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]/css/[name].[contenthash:8].css',
            chunkFilename: '[name]/css/[id].css'
        })
    ].concat(htmlWebpackPlugins)
}
