const path = require('path')

// 公共webpack配置
const webpackBaseConfig = require('./webpack.base.config.js')

// html模板解析
const HtmlWebpackPlugin = require('html-webpack-plugin')
// js代码压缩工具
const TerserWebpackPlugin = require('terser-webpack-plugin')
// 配置选项合并
const { merge } = require('webpack-merge')
// 压缩css
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// 自动清空dist文件夹
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = merge(webpackBaseConfig, {
    // 指定构建环境
    mode: 'production',
    plugins:[
        new HtmlWebpackPlugin({
            title: '极限编程网',
            filename: 'index.html',
            inject: true, // 注入选项 有四个值 true,body(script标签位于body底部),head,false(不插入js文件)
            template: './src/index.html',
            hash: true, // 回给script标签中的js文件增加一个随机数 防止缓存 bundle.js?22b9692e22e7be37b57e
            // 压缩选项 会有很多选项 可以去npm官网上查看对应的配置
            minify: {
                removeComments: true, // 去注释
                collapseWhitespace: true, // 去空格
                removeAttributeQuotes: true, // 去属性的引号
            }
        }),
        new CleanWebpackPlugin()
    ],
    optimization: {
        minimizer: [
            new TerserWebpackPlugin({
                parallel: true, // 启用多进程并行运行
                exclude: /\/node_modules/, // 排除文件夹
                extractComments: true, // 这个选项如果为true 会生成一个app.js.LICENSE.txt文件 存储特定格式的注释
                terserOptions: {
                    mangle: true, // 混淆，默认也是开的，mangle也是可以配置很多选项的，具体看后面的链接
                    compress: {
                        drop_console: true, //传true就是干掉所有的console.*这些函数的调用.
                        drop_debugger: true, //干掉那些debugger;
                        pure_funcs: ['console.log'] // 如果你要干掉特定的函数比如console.info ，又想删掉后保留其参数中的副作用，那用pure_funcs来处理
                    }
                }
            }),
            new OptimizeCssAssetsPlugin({
                // 傳入編譯器可傳遞選項 (可選)
                cssProcessorPluginOptions: {
                  preset: ['default', { discardComments: { removeAll: true } }],
                },
                cssProcessorOptions: {
                    // mini-css-extract-plugin搭配optimize-css-assets-webpack-plugin，生成sourcemap时失败
                    // inline: false, 避免生成内联映射
                    // annotation: true, 向.css文件添加source-map路径注释
                    map: {
                        inline: false,
                        annotation: true,
                    },
                },
            }),
        ]
    }
})
