// build/webpack.base.config.js
const path = require('path')

const devMode = process.env.NODE_ENV === 'development' // 是否是开发模式

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

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
            filename: 'css/[name].[hash:6].css',
            chunkFilename: 'css/[id].css'
        })
    ]
}
