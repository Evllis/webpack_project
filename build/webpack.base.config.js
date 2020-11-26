// build/webpack.base.config.js
const path = require('path')
const webpack = require('webpack')

const devMode = process.env.NODE_ENV === 'development' // 是否开发模式

const setMPA = require('./util')

const { entry, htmlWebpackPlugins } = setMPA()

// css压缩
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    // 入口
    entry,
    output: {
        filename: '[name]/js/index.[contenthash:8].bundle.js',
        chunkFilename: '[name]/js/common.[chunkhash:8].js',
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
            chunkFilename: '[name]/css/[name].[contenthash:8].css'
        }),
        new webpack.ProvidePlugin( {
            // npm i jquery -S 安装jquery，然后利用ProvidePlugin这个webpack内置API将jquery设置为全局引入，从而无需单个页面import引入
            $: 'jquery'
        } ),
    ].concat(htmlWebpackPlugins),
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {  //拆分第三方库（通过npm|yarn安装的库）
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'initial',
                    priority: -10
                },
                //打包公共模块
                commons: {
                    chunks: 'initial', // initial表示提取入口文件的公共部分
                    minChunks: 2,  // 模块被引用2次以上的才抽离
                    minSize: 0, // 表示提取公共部分最小的大小
                    name: 'common', // 提取出来的文件命名
                    priority: -20 // 拆分规则优先级
                },
                // locallib: {  //拆分指定文件
                //     test: /(src\/locallib\.js)$/,
                //     name: 'locallib',
                //     chunks: 'initial',
                //     priority: -9
                // }
            }
        },
        // 为 webpack 运行时代码创建单独的chunk
        // runtimeChunk: {
        //     name: 'manifest'
        // }
    }
}
