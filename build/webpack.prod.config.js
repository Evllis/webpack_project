const path = require('path')
// 安装html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
    ]
})
