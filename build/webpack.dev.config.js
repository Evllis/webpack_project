const path = require('path')

// 安装html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin')

const webpackBaseConfig = require('./webpack.base.config.js')

// 根据不同规则合并两个配置项
const { merge } = require('webpack-merge')

module.exports = merge(webpackBaseConfig, {
    // 指定构建环境
    mode: 'development',
    plugins:[]
})
