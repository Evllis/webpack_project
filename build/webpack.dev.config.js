const path = require('path')

// 安装html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin')

const webpackBaseConfig = require('./webpack.base.config.js')

// 根据不同规则合并两个配置项
const { merge } = require('webpack-merge')

module.exports = merge(webpackBaseConfig, {
    // 指定构建环境
    mode: 'development',
    plugins:[],
    devServer: {
        port: 9001, // 提供访问的端口
        // 响应404时返回index.html
        historyApiFallback: {
            rewrites: [
                { from: /^\/$/, to: '/views/index/index.html' },
                { from: /./, to: '/views/404.html' }
            ]
        },
        hot: true,
        // contentBase: [path.join(__dirname, "public"), path.join(__dirname, "assets")],
        contentBase: false, // 设置server对外服务的内容来源，只有在提供静态文件访问的情况下才需要使用该配置。
        compress: false, // 对所有请求启用gzip压缩
        noInfo: false,
        stats: 'errors-only'
    }
})
