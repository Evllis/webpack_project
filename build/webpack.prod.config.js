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
// 构建包分析
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// 静态资源不需要webpack处理
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = merge(webpackBaseConfig, {
    // 指定构建环境
    mode: 'production',
    plugins:[
        new CleanWebpackPlugin(),
        new BundleAnalyzerPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, '../src/assets/img'),
                    to: path.resolve(__dirname, '../dist/img')
                }
            ]
        })
    ],
    optimization: {
        splitChunks: {
            // async表示只从异步加载得模块（动态加载import()）里面进行拆分(会拆分出通过懒加载等方式异步加载的模块)
            // initial表示只从入口模块进行拆分（入口文件会包含node_modules中的react-dom等包,但是在blog.js中异步加载的marterial等插件就没有拆分出来 和业务代码打包成了一个包）
            // all表示以上两者都包括
            chunks: 'all',
            minSize: 30000, // 代码分割最小的模块大小，引入的模块大于 30000B 才做代码分割
            // maxSize: 0, // 代码分割最大的模块大小，大于这个值要进行代码分割，一般使用默认值
            minChunks: 1, // 引入的次数大于等于1时才进行代码分割
            // import()文件本身算一个
            // 只计算js，不算css
            // 如果同时有两个模块满足cacheGroup的规则要进行拆分，但是maxInitialRequests的值只能允许再拆分一个模块，那尺寸更大的模块会被拆分出来
            // maxAsyncRequests: 5,  // 最大的按需加载（异步）请求次数
            // 最大的初始化加载请求次数,为了对请求数做限制，不至于拆分出来过多模块
            // 入口文件算一个
            // 如果这个模块有异步加载的不算
            // 只算js，不算css
            // 通过runtimeChunk拆分出来的runtime不算在内
            // 如果同时又两个模块满足cacheGroup的规则要进行拆分，但是maxInitialRequests的值只能允许再拆分一个模块，那尺寸更大的模块会被拆分出来
            maxInitialRequests: 3, // 入口文件做代码分割最多分成 3 个 js 文件
            automaticNameDelimiter: '~', // 文件生成时的连接符
            cacheGroups: {
                // 默认的配置
                vendors: {
                    test: /[\\/]node_modules[\\/]/, // 位于node_modules中的模块做代码分割
                    priority: -10 // 根据优先级决定打包到哪个组里，例如一个 node_modules 中的模块进行代码
                },
                // 分割，既满足 vendors，又满足 default，那么根据优先级会打包到 vendors 组中
                default: {
                    // 没有 test 表明所有的模块都能进入 default 组，但是注意它的优先级较低
                    minChunks: 2, // 引用超过两次的模块 -> default
                    priority: -20, //  根据优先级决定打包到哪个组里,打包到优先级高的组里
                    reuseExistingChunk: true // 如果一个模块已经被打包过了,那么再打包时就忽略这个上模块
                },
            },
        },
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
