const path = require('path')
// 安装html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const webpackBaseConfig = require('./webpack.base.config.js')
const { merge } = require('webpack-merge')

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
            meta: {
              'set-cookie': { 'http-equiv': 'set-cookie', content: 'name=value; expires=date; path=url' },
            },
            // 压缩选项 会有很多选项 可以去npm官网上查看对应的配置
            minify: {
                removeComments: true, // 去注释
                collapseWhitespace: true, // 去空格
                removeAttributeQuotes: true, // 去属性的引号
            }
        })
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    mangle: true, // 混淆，默认也是开的，mangle也是可以配置很多选项的，具体看后面的链接
                    compress: {
                        drop_console: true, //传true就是干掉所有的console.*这些函数的调用.
                        drop_debugger: true, //干掉那些debugger;
                        pure_funcs: ['console.log'] // 如果你要干掉特定的函数比如console.info ，又想删掉后保留其参数中的副作用，那用pure_funcs来处理
                    }
                }
            })
        ]
    }
})
