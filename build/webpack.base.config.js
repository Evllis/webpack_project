// build/webpack.base.config.js
const path = require('path')
const webpack = require('webpack')

const devMode = process.env.NODE_ENV === 'development' // 是否开发模式

const setMPA = require('./util')

const { entry, htmlWebpackPlugins } = setMPA()

// css压缩
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    // 入口
    entry,
    output: {
        filename: '[name]/js/index.[contenthash:8].bundle.js',
        chunkFilename: '[name]/js/common.[chunkhash:8].js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/' // 打包后的资源的访问路径前缀
    },
    resolve: {
        // 文件扩展名，写明以后就不需要每个文件写后缀
        // extensions: ['.js', '.css', '.json'],
        // 路径别名，比如这里可以使用 css 指向 static/css 路径
        alias: {
            '@': resolve('src'),
        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/, // 这个node_modules文件夹里面的js/jsx文件不需要使用babel-loader
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            // ES6、ES7语法解析
                            presets: ['@babel/preset-env', '@babel/react'],
                            plugins: [
                                // 支持装饰器
                                ['@babel/plugin-proposal-decorators', { 'legacy': true }]
                            ]
                        }
                    }
                ],
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
                test: /(iconfont.svg)|\.(woff|woff2|eot|ttf|otf|)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            publicPath: './common/font/',
                            outputPath: 'common/font/',
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [
                    // {
                    //     loader: 'file-loader',
                    //     options: {
                    //         name: 'img/[name].[ext]'
                    //     }
                    // }
                    {
                        loader: 'url-loader',
                        // 配置 url-loader 的可选项
                        options: {
                            // 限制 图片大小 10000B，小于限制会将图片转换为 base64格式，写入JS
                            limit: 10000,
                            // 超出限制，创建的文件格式
                            // build/images/[图片名].[hash].[图片格式]
                            name: 'common/img/[name].[hash:8].[ext]'
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
