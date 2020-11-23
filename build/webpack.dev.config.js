const path = require('path')

// 安装html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin')

const webpackBaseConfig = require('./webpack.base.config.js')

// 根据不同规则合并两个配置项
const { merge } = require('webpack-merge')

module.exports = merge(webpackBaseConfig, {
    // 指定构建环境
    mode: 'development',
    plugins:[
        new HtmlWebpackPlugin({
            title: '极限编程网',
            filename: 'index.html',
            template: './src/index.html',
            inject: true // 注入选项 有四个值 true,body(script标签位于body底部),head,false(不插入js文件)
        })
    ]
})
